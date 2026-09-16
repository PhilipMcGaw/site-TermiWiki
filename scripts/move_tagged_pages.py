#!/usr/bin/env python3
"""Move front-matter-tagged pages into a source-vault subfolder safely."""

from __future__ import annotations

import argparse
import os
import re
from pathlib import Path


MARKDOWN_LINK = re.compile(r"\]\(([^)#]+\.md)(#[^)]+)?\)")


def tags_for(page: Path) -> set[str]:
    lines = page.read_text().splitlines()
    try:
        end = lines.index("---", 1)
    except ValueError:
        return set()
    return {line[4:].strip().strip('"') for line in lines[1:end] if line.startswith("  - ")}


def relative_link(source_directory: Path, target: Path) -> str:
    return Path(os.path.relpath(target, source_directory)).as_posix()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("tag", help="front-matter tag to select")
    parser.add_argument("destination", help="destination folder name within the vault")
    parser.add_argument("--write", action="store_true", help="apply changes")
    parser.add_argument("root", nargs="?", default=Path(__file__).resolve().parent.parent / "source")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    destination = root / args.destination
    pages = sorted(root.rglob("*.md"))
    selected = {
        page.resolve()
        for page in pages
        if args.tag in tags_for(page) and destination not in page.parents
    }
    collisions = [page.name for page in selected if (destination / page.name).exists()]
    if collisions:
        raise SystemExit(f"destination filename collision(s): {', '.join(sorted(collisions))}")
    if not selected:
        raise SystemExit(f"no pages tagged {args.tag!r}")

    print(f"Selected {len(selected)} page(s) tagged {args.tag!r}.")
    changed = 0
    for page in pages:
        original = page.read_text()
        future_page_parent = destination if page.resolve() in selected else page.parent

        def replacement(match: re.Match[str]) -> str:
            target, fragment = match.groups()
            resolved_target = (page.parent / target).resolve()
            if resolved_target not in selected and not resolved_target.is_file():
                return match.group(0)
            future_target = destination / resolved_target.name if resolved_target in selected else resolved_target
            return f"]({relative_link(future_page_parent, future_target)}{fragment or ''})"

        updated = MARKDOWN_LINK.sub(replacement, original)
        if updated != original:
            changed += 1
            if args.write:
                page.write_text(updated)
    print(f"Updated links in {changed} page(s).")
    if args.write:
        destination.mkdir(exist_ok=True)
        for page in sorted(selected):
            page.rename(destination / page.name)
        print(f"Moved {len(selected)} page(s) to {destination}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
