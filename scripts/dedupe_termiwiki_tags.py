#!/usr/bin/env python3
"""Remove later duplicate YAML tag entries from TermiWiki Markdown files.

Run without --write to report candidates; use --write to update them.  The
script deliberately changes only the initial front-matter ``tags:`` list and
refuses files whose front matter is not delimited by the first two ``---``.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import re


def dedupe_tags(text: str) -> tuple[str, int]:
    lines = text.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        raise ValueError("missing opening front-matter delimiter")
    try:
        end = next(index for index in range(1, len(lines)) if lines[index].strip() == "---")
    except StopIteration as error:
        raise ValueError("missing closing front-matter delimiter") from error

    front_matter = lines[: end + 1]
    seen: set[str] = set()
    in_tags = False
    result: list[str] = []
    removed = 0
    for line in front_matter:
        if line.startswith("tags:"):
            in_tags = True
            result.append(line)
            continue
        if in_tags and line.startswith("  - "):
            tag = line.strip()[2:].strip()
            if tag in seen:
                removed += 1
                continue
            seen.add(tag)
            result.append(line)
            continue
        if in_tags:
            in_tags = False
        result.append(line)
    return "".join(result + lines[end + 1 :]), removed


def normalise_markdown_headings(text: str) -> tuple[str, int]:
    """Remove a trailing DokuWiki ``=`` left on ATX Markdown headings."""
    pattern = re.compile(r"^(#{1,6}\s+.+?)\s*=+\s*$", re.MULTILINE)
    return pattern.subn(r"\1", text)


def rewrite_media_paths(text: str) -> tuple[str, int]:
    """Replace the legacy standalone-vault media path with the vault-root path."""
    return text.replace("Media/sites/termiwiki/", "Media/"), text.count("Media/sites/termiwiki/")


def normalise_imported_link_labels(text: str) -> tuple[str, int]:
    """Keep the display label from ``[legacy alias|display](target)`` links."""
    pattern = re.compile(r"\[([^\]\n|]+)\|([^\]\n]+)\](\([^\n)]+\))")
    return pattern.subn(r"[\2]\3", text)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true", help="apply changes")
    parser.add_argument(
        "--normalise-headings",
        action="store_true",
        help="remove trailing DokuWiki equals signs from Markdown headings",
    )
    parser.add_argument(
        "--rewrite-media-paths",
        action="store_true",
        help="replace legacy Media/sites/termiwiki paths with Media paths",
    )
    parser.add_argument(
        "--normalise-link-labels",
        action="store_true",
        help="keep the display text after pipes in imported Markdown link labels",
    )
    default_root = Path(__file__).resolve().parent.parent / "source"
    parser.add_argument("root", nargs="?", default=default_root)
    args = parser.parse_args()

    changed_files = 0
    removed_tags = 0
    for path in sorted(Path(args.root).rglob("*.md")):
        original = path.read_text()
        updated, removed = dedupe_tags(original)
        heading_changes = 0
        media_path_changes = 0
        link_label_changes = 0
        if args.normalise_headings:
            updated, heading_changes = normalise_markdown_headings(updated)
        if args.rewrite_media_paths:
            updated, media_path_changes = rewrite_media_paths(updated)
        if args.normalise_link_labels:
            updated, link_label_changes = normalise_imported_link_labels(updated)
        if not removed and not heading_changes and not media_path_changes and not link_label_changes:
            continue
        changed_files += 1
        removed_tags += removed
        details = []
        if removed:
            details.append(f"{removed} duplicate tag(s)")
        if heading_changes:
            details.append(f"{heading_changes} heading(s)")
        if media_path_changes:
            details.append(f"{media_path_changes} media path(s)")
        if link_label_changes:
            details.append(f"{link_label_changes} link label(s)")
        print(f"{path}: {', '.join(details)}")
        if args.write:
            path.write_text(updated)
    action = "Updated" if args.write else "Would update"
    print(f"{action} {changed_files} file(s); removed {removed_tags} duplicate tag(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
