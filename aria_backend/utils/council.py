import os
from .ollama_client import chat_ollama

MAIN_MODEL = os.getenv("ARIA_MAIN_MODEL", "aria-uncensored")
COUNCIL = [m.strip() for m in os.getenv("ARIA_COUNCIL_MODELS", "").split(",") if m.strip()]

SYSTEM_MAIN = (
    "You are Aria: concise, candid, practical. If COUNCIL_NOTES are provided, "
    "critique them and produce the best final answer. Always include a short 'How to execute' list if the user asked 'how'."
)

SYSTEM_COUNCIL = (
    "You are an expert peer in an internal council. Provide bullet-point analysis, pitfalls, and a direct recommendation. Keep it under 200 words."
)

def deliberate(user_prompt: str, temperature=0.6):
    notes = []
    for m in COUNCIL:
        try:
            council_reply = chat_ollama(
                model=m,
                system=SYSTEM_COUNCIL,
                messages=[{"role": "user", "content": user_prompt}],
                temperature=temperature,
                stream=False,
            )
            notes.append(f"[{m}] {council_reply}")
        except Exception as e:
            notes.append(f"[{m}] (error: {e})")

    stitched = "\n\n".join(notes)
    final = chat_ollama(
        model=MAIN_MODEL,
        system=SYSTEM_MAIN,
        messages=[{"role": "user", "content": f"User query:\n{user_prompt}\n\nCOUNCIL_NOTES:\n{stitched}"}],
        temperature=temperature,
        stream=False,
    )
    return final, stitched 