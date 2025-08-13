import json
import os
from typing import List, Dict, Any

MEMORY_FILE = os.environ.get("ARIA_MEMORY_FILE", os.path.join(os.path.dirname(__file__), "aria_memory.json"))


def load_memory() -> List[Dict[str, Any]]:
    try:
        if not os.path.exists(MEMORY_FILE):
            return []
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            # Ensure list of role/content dicts
            if isinstance(data, list):
                return [m for m in data if isinstance(m, dict) and "role" in m and "content" in m]
            return []
    except Exception:
        return []


def save_memory(messages: List[Dict[str, Any]]) -> None:
    try:
        with open(MEMORY_FILE, "w", encoding="utf-8") as f:
            json.dump(messages, f, ensure_ascii=False, indent=2)
    except Exception:
        # Best-effort persistence; swallow IO errors
        pass 