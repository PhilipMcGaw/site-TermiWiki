---
title: "Adler-8 and privacy-preserving phone comparison"
date: 2026-09-18
type: source-record
status: checked
source_type: web-research
publication_status: research-only
confidence: High
---
# Adler-8 and privacy-preserving phone comparison

## Finding

The term Adler-8 was checked as a possible checksum. Adler variants are checksum functions intended for error detection, not keyed cryptographic identifiers. An 8-bit output also provides only 256 possible values, making collisions unavoidable and frequent for even a small set of phone numbers.

For comparing phone numbers without publishing them, a keyed HMAC such as HMAC-SHA-256 remains the appropriate approach. The secret key must remain outside the repository.

## Source and retrieval

- Search date: 2026-09-18.
- Sources checked: FAA checksum guidance and technical checksum references returned for Adler-8 searches.
- FAA source: https://www.faa.gov/sites/faa.gov/files/aircraft/air_cert/design_approvals/air_software/TC-14-49.pdf

## Confidence

- Adler-8 is unsuitable for privacy-preserving identity comparison: **High**.
- HMAC-SHA-256 is preferable for keyed equality comparison: **High**, based on standard cryptographic practice.