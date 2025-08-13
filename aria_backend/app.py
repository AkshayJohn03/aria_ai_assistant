import os
import uuid
import shutil
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv

from utils.memory import new_session_id, load_session, save_session, add_message, get_recent_dialogue
from utils.ollama_client import chat_ollama
from utils.search import web_search
from utils.docs import create_pdf, annotate_pdf, create_or_update_excel, create_docx, ocr_image, FILES_DIR
from utils.council import deliberate

load_dotenv()

MAIN_MODEL = os.getenv("ARIA_MAIN_MODEL", "aria-uncensored")
DEFAULT_SYSTEM = (
    "You are Aria — my local strategic assistant. Be fast, concrete, and actionable.\n"
    "Keep answers compact by default; use bullets and steps.\n"
    "If I toggle deep think, you will consult the council and then present the final answer.\n"
    "You remember context across sessions (short summary first if history is long)."
)

app = Flask(__name__)
CORS(app, supports_credentials=True)

# ---------- Health ----------
@app.get("/api/health")
def health():
    return {"ok": True, "model": MAIN_MODEL}

# ---------- Session ----------
@app.post("/api/session/new")
def new_session():
    sid = new_session_id()
    save_session({"session_id": sid, "messages": [], "facts": []})
    return {"session_id": sid}

@app.get("/api/session/<sid>")
def get_session(sid):
    return load_session(sid)

@app.delete("/api/session/<sid>")
def delete_session(sid):
    p = os.path.join("data","sessions", f"{sid}.json")
    if os.path.exists(p):
        os.remove(p)
    return {"deleted": True}

# ---------- Chat ----------
@app.post("/api/chat")
def chat():
    data = request.json or {}
    sid = data.get("session_id")
    if not sid:
        return {"error": "session_id required"}, 400

    user_msg = data.get("message","{} ").strip()
    deep_think = bool(data.get("deep_think", False))
    temperature = float(data.get("temperature", 0.6))
    use_search = bool(data.get("web_search", False))

    history = get_recent_dialogue(sid, limit=20)
    messages = [{"role": m["role"], "content": m["content"]} for m in history] + [{"role":"user","content": user_msg}]

    search_blurb = ""
    if use_search:
        results = web_search(user_msg, k=5)
        if results:
            lines = [f"- {r['title']} — {r['url']}\n  {r['snippet']}" for r in results]
            search_blurb = "WEB RESULTS:\n" + "\n".join(lines)
            messages.append({"role":"system","content": f"Use these web snippets as context:\n{search_blurb}"})

    if deep_think:
        final, notes = deliberate(user_msg, temperature=temperature)
        assistant_text = final + ("\n\n—\n(Internal council notes hidden)" if not data.get("show_council") else f"\n\n—\nCOUNCIL NOTES:\n{notes}")
    else:
        assistant_text = chat_ollama(
            model=MAIN_MODEL,
            system=DEFAULT_SYSTEM,
            messages=messages,
            temperature=temperature,
            stream=False
        )

    add_message(sid, "user", user_msg)
    add_message(sid, "assistant", assistant_text)
    return {"reply": assistant_text, "used_search": bool(use_search)}

# ---------- Uploads & OCR ----------
@app.post("/api/upload")
def upload():
    sid = request.form.get("session_id")
    if not sid:
        return {"error":"session_id required"}, 400
    if "file" not in request.files:
        return {"error":"no file"}, 400
    f = request.files["file"]
    fname = f"{uuid.uuid4()}_{f.filename}"
    dst = os.path.join(FILES_DIR, fname)
    f.save(dst)

    if f.mimetype and f.mimetype.startswith("image/"):
        try:
            text = ocr_image(dst)
        except Exception as e:
            text = f"(OCR error: {e})"
        add_message(sid, "assistant", f"Uploaded image '{f.filename}'. OCR text:\n\n{text[:2000]}")
        return {"saved_as": fname, "ocr_text": text}

    add_message(sid, "assistant", f"Uploaded file '{f.filename}' saved.")
    return {"saved_as": fname}

# ---------- PDF / Excel / Word ----------
@app.post("/api/pdf/create")
def pdf_create():
    data = request.json or {}
    text = data.get("text","").strip()
    filename = data.get("filename","aria_output.pdf")
    path = create_pdf(text, filename)
    return {"path": path}

@app.post("/api/pdf/annotate")
def pdf_annotate():
    data = request.json or {}
    src = data.get("source_path")
    notes = data.get("notes","")
    out_name = data.get("out_name","annotated.pdf")
    if not src or not os.path.exists(src):
        return {"error":"source_path missing/invalid"}, 400
    path = annotate_pdf(src, notes, out_name)
    return {"path": path}

@app.post("/api/excel/update")
def excel_update():
    data = request.json or {}
    filename = data.get("filename","aria_sheet.xlsx")
    sheet = data.get("sheet","Sheet1")
    cell = data.get("cell","A1")
    value = str(data.get("value",""))
    path = create_or_update_excel(filename, sheet, cell, value)
    return {"path": path}

@app.post("/api/docx/create")
def docx_create():
    data = request.json or {}
    text = data.get("text","")
    filename = data.get("filename","aria_doc.docx")
    path = create_docx(text, filename)
    return {"path": path}

# ---------- Download ----------
@app.get("/api/download")
def download():
    path = request.args.get("path")
    if not path or not os.path.exists(path):
        return {"error":"invalid path"}, 400
    return send_file(path, as_attachment=True)

# ---------- Clean files (optional) ----------
@app.delete("/api/files/clear")
def clear_files():
    files_dir = os.path.join("data", "files")
    if os.path.exists(files_dir):
        shutil.rmtree(files_dir)
    os.makedirs(files_dir, exist_ok=True)
    return {"cleared": True}

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5050, debug=True) 