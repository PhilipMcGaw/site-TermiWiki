#!/usr/bin/env python3
"""Create a reviewable inventory of Internet Archive Wayback captures.

This is intentionally an inventory tool, not a website downloader. It queries
the Wayback CDX API and writes capture metadata as JSON or CSV. Review the
inventory before retrieving files or promoting evidence into the vault.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

CDX_ENDPOINT = "https://web.archive.org/cdx/search/cdx"
FIELDS = ("timestamp", "original", "mimetype", "statuscode", "digest", "length")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", help="URL, host, or domain to search")
    parser.add_argument("--match-type", choices=("exact", "prefix", "host", "domain"), default="exact")
    parser.add_argument("--from", dest="from_date", help="Earliest capture, YYYY or YYYYMMDD...")
    parser.add_argument("--to", dest="to_date", help="Latest capture, YYYY or YYYYMMDD...")
    parser.add_argument("--filter", action="append", default=[], metavar="FIELD:REGEX", help="CDX filter; may be repeated")
    parser.add_argument("--collapse", action="append", default=["urlkey"], help="CDX collapse field; may be repeated")
    parser.add_argument("--no-collapse", action="store_true", help="Keep every matching capture")
    parser.add_argument("--limit", type=int, default=1000, help="Records per request (default: 1000)")
    parser.add_argument("--all-pages", action="store_true", help="Use CDX pagination for large result sets")
    parser.add_argument("--page-size", type=int, default=1, help="CDX pagination page size (default: 1)")
    parser.add_argument("--timeout", type=float, default=60.0, help="HTTP timeout in seconds")
    parser.add_argument("--user-agent", default="TermiWiki-Wayback-Inventory/1.0")
    parser.add_argument("--format", choices=("json", "csv"), default="json")
    parser.add_argument("--output", type=Path, help="Output path; default is standard output")
    return parser.parse_args()


def request_json(params: list[tuple[str, str]], timeout: float, user_agent: str) -> Any:
    request = Request(f"{CDX_ENDPOINT}?{urlencode(params)}", headers={"Accept-Encoding": "identity", "User-Agent": user_agent})
    with urlopen(request, timeout=timeout) as response:
        return json.load(response)


def base_params(args: argparse.Namespace) -> list[tuple[str, str]]:
    params = [("url", args.url), ("matchType", args.match_type), ("output", "json"), ("fl", ",".join(FIELDS)), ("gzip", "false"), ("limit", str(args.limit))]
    if args.from_date:
        params.append(("from", args.from_date))
    if args.to_date:
        params.append(("to", args.to_date))
    for value in args.filter:
        params.append(("filter", value))
    if not args.no_collapse:
        for value in args.collapse:
            params.append(("collapse", value))
    return params


def rows_from_response(payload: Any) -> list[dict[str, str]]:
    if not isinstance(payload, list) or not payload:
        return []
    header = payload[0]
    if not isinstance(header, list):
        raise ValueError("Unexpected CDX JSON response")
    return [{str(key): str(value) for key, value in zip(header, values)} for values in payload[1:] if isinstance(values, list)]


def fetch_rows(args: argparse.Namespace) -> list[dict[str, str]]:
    params = base_params(args)
    if not args.all_pages:
        return rows_from_response(request_json(params, args.timeout, args.user_agent))
    count_params = params + [("showNumPages", "true"), ("pageSize", str(args.page_size))]
    payload = request_json(count_params, args.timeout, args.user_agent)
    if isinstance(payload, list) and len(payload) == 1:
        payload = payload[0]
    try:
        page_count = int(payload)
    except (TypeError, ValueError) as exc:
        raise RuntimeError(f"CDX did not return a page count: {payload!r}") from exc
    rows: list[dict[str, str]] = []
    for page in range(page_count):
        page_params = params + [("page", str(page)), ("pageSize", str(args.page_size))]
        rows.extend(rows_from_response(request_json(page_params, args.timeout, args.user_agent)))
    return rows


def write_rows(rows: list[dict[str, str]], args: argparse.Namespace) -> None:
    destination = args.output.open("w", newline="", encoding="utf-8") if args.output else sys.stdout
    try:
        if args.format == "csv":
            writer = csv.DictWriter(destination, fieldnames=FIELDS, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(rows)
        else:
            json.dump(rows, destination, ensure_ascii=False, indent=2)
            destination.write("\n")
    finally:
        if args.output:
            destination.close()


def main() -> int:
    args = parse_args()
    if args.limit < 1 or args.page_size < 1:
        raise SystemExit("--limit and --page-size must be positive")
    try:
        rows = fetch_rows(args)
        write_rows(rows, args)
    except Exception as exc:  # noqa: BLE001 - concise CLI error
        print(f"wayback_inventory.py: {exc}", file=sys.stderr)
        return 1
    if args.output:
        print(f"Wrote {len(rows)} records to {args.output}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())