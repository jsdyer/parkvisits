"""Fetch publisher resources and replace a complete, validated edition atomically."""
from datetime import datetime, timezone
import json
import time
from urllib.error import URLError
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
EDITION = ROOT / "web/data/edition.json"


def fetch(url):
    request = Request(url, headers={"User-Agent": "Mozilla/5.0 (CoolCode public data refresh)"})
    for attempt in range(3):
        try:
            with urlopen(request, timeout=80) as response:
                return response.read()
        except (URLError, TimeoutError):
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)


def publish(edition):
    edition["count"] = len(edition["sites"])
    edition["retrieved"] = datetime.now(timezone.utc).date().isoformat()
    output = EDITION.with_suffix(".tmp")
    output.write_text(json.dumps(edition, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    output.replace(EDITION)
