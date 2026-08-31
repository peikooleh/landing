#!/usr/bin/env python3
"""Refresh MOYAMOVA YouTube videos and public playlists without an API key."""
from __future__ import annotations

import html
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from yt_dlp import YoutubeDL
except ImportError:
    YoutubeDL = None

CHANNELS = {
    "uk": "UCo_Srxy3jqF4PbuxgldLpWA",
    "ru": "UChUFZoc6nnrzqPCsKQx5xmw",
}
VIDEO_LIMIT = 3
PLAYLIST_LIMIT = 40
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "data" / "youtube.json"

NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
}


def request_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=35) as response:
        return response.read()


def fetch_videos(channel_id: str) -> list[dict]:
    url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    root = ET.fromstring(request_bytes(url))
    videos: list[dict] = []
    for entry in root.findall("atom:entry", NS)[:VIDEO_LIMIT]:
        video_id = (entry.findtext("yt:videoId", default="", namespaces=NS) or "").strip()
        if not video_id:
            continue
        title = (entry.findtext("atom:title", default="MOYAMOVA", namespaces=NS) or "MOYAMOVA").strip()
        published = (entry.findtext("atom:published", default="", namespaces=NS) or "").strip()
        thumbnail = entry.find("media:group/media:thumbnail", NS)
        thumb_url = thumbnail.get("url") if thumbnail is not None else f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
        videos.append({
            "id": video_id,
            "title": title,
            "published": published,
            "thumbnail": thumb_url,
        })
    return videos


def decode_json_after_marker(page: str, marker: str) -> dict | None:
    """Decode one JSON object after marker using JSONDecoder.raw_decode (brace-safe)."""
    pos = page.find(marker)
    if pos < 0:
        return None
    pos += len(marker)

    # Skip whitespace, ':' and '=' until the first opening brace.
    brace = page.find("{", pos)
    if brace < 0:
        return None

    try:
        value, _ = json.JSONDecoder().raw_decode(page[brace:])
        return value if isinstance(value, dict) else None
    except json.JSONDecodeError:
        return None


def extract_initial_data(page: str) -> dict:
    # YouTube has used all of these forms over time.
    markers = (
        "var ytInitialData =",
        "ytInitialData =",
        'window["ytInitialData"] =',
        "window['ytInitialData'] =",
        '"ytInitialData":',
    )
    for marker in markers:
        data = decode_json_after_marker(page, marker)
        if data:
            return data

    # Fallback: sometimes the JSON is embedded after this assignment without spaces.
    match = re.search(r"(?:var\s+)?ytInitialData\s*=", page)
    if match:
        brace = page.find("{", match.end())
        if brace >= 0:
            try:
                value, _ = json.JSONDecoder().raw_decode(page[brace:])
                if isinstance(value, dict):
                    return value
            except json.JSONDecodeError:
                pass

    raise RuntimeError("ytInitialData not found")


def walk(value: Any):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def text_value(value: Any) -> str:
    if not isinstance(value, dict):
        return ""
    simple = value.get("simpleText")
    if isinstance(simple, str):
        return simple.strip()
    runs = value.get("runs")
    if isinstance(runs, list):
        return "".join(
            str(run.get("text", ""))
            for run in runs
            if isinstance(run, dict)
        ).strip()
    return ""


def source_url(value: Any) -> str:
    """Find the largest thumbnail URL anywhere under a renderer."""
    candidates: list[tuple[int, str]] = []
    for node in walk(value):
        if not isinstance(node, dict):
            continue
        url = node.get("url")
        if not isinstance(url, str):
            continue
        if not (
            "ytimg.com" in url
            or "ggpht.com" in url
            or url.startswith("//")
        ):
            continue
        area = 0
        try:
            area = int(node.get("width") or 0) * int(node.get("height") or 0)
        except Exception:
            area = 0
        candidates.append((area, html.unescape(url)))
    if not candidates:
        return ""
    candidates.sort(key=lambda x: x[0])
    url = candidates[-1][1]
    return "https:" + url if url.startswith("//") else url


def parse_count(text: str) -> int | None:
    if not text:
        return None
    match = re.search(r"(\d[\d\s.,]*)", text)
    if not match:
        return None
    digits = re.sub(r"\D+", "", match.group(1))
    return int(digits) if digits else None


def renderer_title(renderer: dict) -> str:
    # Common playlist renderers.
    for key in ("title", "headline", "primaryText"):
        title = text_value(renderer.get(key))
        if title:
            return title

    # New lockup metadata model.
    metadata = renderer.get("metadata")
    if isinstance(metadata, dict):
        for node in walk(metadata):
            for key in ("title", "headline", "primaryText"):
                title = text_value(node.get(key)) if isinstance(node, dict) else ""
                if title:
                    return title

    # Last resort: look for text-bearing runs near this renderer.
    for node in walk(renderer):
        if not isinstance(node, dict):
            continue
        text = text_value(node)
        if text and len(text) <= 180:
            return text
    return ""


def playlist_id_from_renderer(renderer: dict) -> str:
    for key in ("playlistId", "contentId"):
        value = renderer.get(key)
        if isinstance(value, str) and value:
            return value

    # Navigation endpoints often carry the playlist id even when the top-level renderer does not.
    for node in walk(renderer):
        if not isinstance(node, dict):
            continue
        value = node.get("playlistId")
        if isinstance(value, str) and value:
            return value
        url = node.get("url")
        if isinstance(url, str):
            match = re.search(r"(?:[?&]list=|/playlist\?list=)([A-Za-z0-9_-]+)", url)
            if match:
                return match.group(1)
    return ""


def playlist_count_from_renderer(renderer: dict) -> int | None:
    for key in ("videoCountText", "videoCount", "secondaryText", "metadata"):
        value = renderer.get(key)
        if isinstance(value, int):
            return value
        if isinstance(value, str):
            count = parse_count(value)
            if count is not None:
                return count
        if isinstance(value, dict):
            count = parse_count(text_value(value))
            if count is not None:
                return count
    return None


def fetch_playlists(channel_id: str) -> list[dict]:
    """Use yt-dlp's YouTube extractor instead of scraping YouTube HTML ourselves."""
    if YoutubeDL is None:
        raise RuntimeError("yt-dlp is not installed")

    url = f"https://www.youtube.com/channel/{channel_id}/playlists"
    options = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "skip_download": True,
        "playlistend": PLAYLIST_LIMIT,
        "ignoreerrors": True,
        "socket_timeout": 35,
    }

    with YoutubeDL(options) as ydl:
        info = ydl.extract_info(url, download=False)

    if not isinstance(info, dict):
        raise RuntimeError("yt-dlp returned no channel data")

    entries = info.get("entries")
    if not isinstance(entries, list):
        raise RuntimeError("yt-dlp returned no playlist entries")

    playlists: list[dict] = []
    seen: set[str] = set()

    for entry in entries:
        if not isinstance(entry, dict):
            continue

        playlist_id = str(entry.get("id") or "").strip()
        title = str(entry.get("title") or "").strip()
        if not playlist_id or not title or playlist_id in seen:
            continue

        # Channel playlist tab may occasionally surface non-playlist entries.
        webpage_url = str(entry.get("url") or entry.get("webpage_url") or "")
        ie_key = str(entry.get("ie_key") or entry.get("extractor_key") or "").lower()
        if "playlist" not in ie_key and "list=" not in webpage_url and not playlist_id.startswith(("PL", "UU", "OLAK", "RD")):
            continue

        thumbnail = str(entry.get("thumbnail") or "").strip()
        if not thumbnail:
            thumbs = entry.get("thumbnails")
            if isinstance(thumbs, list):
                valid = [t for t in thumbs if isinstance(t, dict) and t.get("url")]
                if valid:
                    thumbnail = str(valid[-1].get("url") or "")

        count = entry.get("playlist_count")
        try:
            count = int(count) if count is not None else None
        except (TypeError, ValueError):
            count = None

        playlists.append({
            "id": playlist_id,
            "title": title,
            "thumbnail": thumbnail,
            "videoCount": count,
            "url": f"https://www.youtube.com/playlist?list={playlist_id}",
        })
        seen.add(playlist_id)

        if len(playlists) >= PLAYLIST_LIMIT:
            break

    if not playlists:
        raise RuntimeError("yt-dlp found 0 public playlists")

    return playlists


def previous_channel(previous: dict, code: str) -> dict:
    value = previous.get("channels", {}).get(code, {})
    if isinstance(value, list):
        return {"videos": value, "playlists": []}
    if isinstance(value, dict):
        return {
            "videos": value.get("videos", []) if isinstance(value.get("videos"), list) else [],
            "playlists": value.get("playlists", []) if isinstance(value.get("playlists"), list) else [],
        }
    return {"videos": [], "playlists": []}


def main() -> None:
    previous: dict = {}
    if OUTPUT.exists():
        try:
            previous = json.loads(OUTPUT.read_text(encoding="utf-8"))
        except Exception:
            previous = {}

    result = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "channels": {},
    }

    for code, channel_id in CHANNELS.items():
        old = previous_channel(previous, code)
        channel = {
            "videos": old["videos"],
            "playlists": old["playlists"],
        }

        try:
            videos = fetch_videos(channel_id)
            if videos:
                channel["videos"] = videos
            print(f"{code}: {len(channel['videos'])} videos")
        except Exception as exc:
            print(f"{code}: video update failed: {exc}")

        try:
            playlists = fetch_playlists(channel_id)
            if playlists:
                channel["playlists"] = playlists
            print(f"{code}: {len(channel['playlists'])} playlists")
        except Exception as exc:
            print(f"{code}: playlist update failed: {exc}")

        result["channels"][code] = channel

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
