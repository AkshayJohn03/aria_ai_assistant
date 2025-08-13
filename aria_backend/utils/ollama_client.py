import os
import requests

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")

def chat_ollama(model: str, system: str, messages, temperature: float = 0.6, stream: bool = False):
    """
    messages: list of {"role": "user"/"assistant"/"system", "content": "..."}
    """
    url = f"{OLLAMA_HOST}/api/chat"
    payload = {
        "model": model,
        "messages": ([{"role": "system", "content": system}] + messages) if system else messages,
        "options": {"temperature": temperature},
        "stream": stream,
    }
    r = requests.post(url, json=payload, timeout=600)
    r.raise_for_status()
    if stream:
        text = ""
        for line in r.iter_lines():
            if not line:
                continue
            try:
                chunk = line.decode("utf-8")
                text += chunk
            except Exception:
                pass
        return text
    else:
        return r.json().get("message", {}).get("content", "") 