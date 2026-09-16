#!/usr/bin/env python3
"""Move TermiSoc profile pages to TermiPeople and preserve Markdown links."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


PERSON_TAGS = {"termimember", "people", "member", "honorary_member"}
NON_PROFILE_PAGES = {"termimember.md", "termiexec.md", "compsoc_exec_2026-27.md", "people.md"}
HISTORICAL_PROFILES = {"alex.md"}
MARKDOWN_LINK = re.compile(r"\]\(([^)#]+\.md)(#[^)]+)?\)")


def tags_for(page: Path) -> set[str]:
    lines = page.read_text().splitlines()
    try:
        end = lines.index("---", 1)
    except ValueError:
        return set()
    return {line[4:].strip().strip('"') for line in lines[1:end] if line.startswith("  - ")}


def selected_profiles(root: Path) -> set[str]:
    return {
        page.name
        for page in root.glob("*.md")
        if page.name not in NON_PROFILE_PAGES and (tags_for(page) & PERSON_TAGS or page.name in HISTORICAL_PROFILES)
    }


def rewrite_links(text: str, current_is_profile: bool, profiles: set[str], root: Path) -> str:
    def replacement(match: re.Match[str]) -> str:
        target, fragment = match.groups()
        if "/" in target:
            return match.group(0)
        if target in profiles:
            destination = target if current_is_profile else f"TermiPeople/{target}"
        elif current_is_profile and (root / target).is_file():
            destination = f"../{target}"
        else:
            return match.group(0)
        return f"]({destination}{fragment or ''})"

    return MARKDOWN_LINK.sub(replacement, text)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true", help="apply changes")
    parser.add_argument("root", nargs="?", default=Path(__file__).resolve().parent.parent / "source")
    args = parser.parse_args()
    root = Path(args.root)
    destination = root / "TermiPeople"
    profiles = selected_profiles(root) | {page.name for page in destination.glob("*.md")}
    print(f"Selected {len(profiles)} profile page(s).")

    changed = 0
    pages = list(root.glob("*.md")) + list(destination.glob("*.md"))
    for page in pages:
        original = page.read_text()
        updated = rewrite_links(original, page.parent == destination, profiles, root)
        if updated != original:
            changed += 1
            if args.write:
                page.write_text(updated)
    print(f"Updated links in {changed} page(s).")
    if args.write:
        destination.mkdir(exist_ok=True)
        to_move = selected_profiles(root)
        for name in sorted(to_move):
            (root / name).rename(destination / name)
        if to_move:
            print(f"Moved {len(to_move)} profile page(s) to {destination}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
