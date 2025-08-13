import os
import json
import time
import uuid
from typing import List, Dict

DATA_DIR = os.path.join("data", "sessions")
os.makedirs(DATA_DIR, exist_ok=True)

def new_session_id() -> str:
    return str(uuid.uuid4())

def _path(session_id: str) -> str:
    return os.path.join(DATA_DIR, f"{session_id}.json")

def load_session(session_id: str) -> Dict:
    p = _path(session_id)
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"session_id": session_id, "messages": [], "facts": []}

def save_session(session: Dict):
    p = _path(session["session_id"])
    with open(p, "w", encoding="utf-8") as f:
        json.dump(session, f, ensure_ascii=False, indent=2)

def add_message(session_id: str, role: str, content: str):
    s = load_session(session_id)
    s["messages"].append({
        "role": role,
        "content": content,
        "ts": int(time.time())
    })
    save_session(s)

def get_recent_dialogue(session_id: str, limit: int = 20) -> List[Dict]:
    s = load_session(session_id)
    return s["messages"][-limit:] 