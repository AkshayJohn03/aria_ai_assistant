import os
import requests
from duckduckgo_search import DDGS

PPLX_KEY = os.getenv("PERPLEXITY_API_KEY")

def web_search(query: str, k: int = 5):
    if PPLX_KEY:
        try:
            r = requests.post(
                "https://api.perplexity.ai/chat/completions",
                headers={"Authorization": f"Bearer {PPLX_KEY}"},
                json={
                    "model": "sonar-small-online",
                    "messages": [{"role": "user", "content": query}],
                    "temperature": 0.0,
                },
                timeout=60,
            )
            r.raise_for_status()
            text = r.json()["choices"][0]["message"]["content"]
            return [{"title": "Perplexity", "snippet": text, "url": ""}]
        except Exception:
            pass
    out = []
    with DDGS() as ddgs:
        for res in ddgs.text(query, max_results=k) or []:
            out.append({
                "title": res.get("title", ""),
                "snippet": res.get("body", ""),
                "url": res.get("href", ""),
            })
    return out 