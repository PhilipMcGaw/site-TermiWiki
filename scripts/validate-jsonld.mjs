#!/usr/bin/env node

/**
 * Validate the JSON-LD emitted by the Quartz build.
 *
 * Usage:
 *   node scripts/validate-jsonld.mjs
 *
 * The validator deliberately checks the generated site rather than the source
 * transformer. This makes it a useful post-build guard against regressions in
 * Quartz's rendering pipeline.
 */

import { readFile, readdir, stat } from "node:fs/promises"
import { join, relative } from "node:path"

const SITE_ROOT = new URL("../site/", import.meta.url)
const EXPECTED_CONTEXT = "https://schema.org"
const errors = []
let htmlFiles = 0
let jsonLdBlocks = 0

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      await walk(path)
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      await validateFile(path)
    }
  }
}

function fail(file, message) {
  errors.push(`${relative(SITE_ROOT.pathname, file)}: ${message}`)
}

function validateSchema(file, schema, index) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    fail(file, `JSON-LD block ${index} is not an object`)
    return
  }

  if (schema["@context"] !== EXPECTED_CONTEXT) {
    fail(file, `JSON-LD block ${index} has an unexpected @context`)
  }

  if (typeof schema["@type"] !== "string") {
    fail(file, `JSON-LD block ${index} has no @type`)
  }

  if (typeof schema.url !== "string" || !/^https:\/\//.test(schema.url)) {
    fail(file, `JSON-LD block ${index} has no valid absolute url`)
  }

  if (schema["@type"] === "Person" && typeof schema.name !== "string") {
    fail(file, `Person JSON-LD block ${index} has no name`)
  }

  if ((schema["@type"] === "Article" || schema["@type"] === "CollectionPage") && typeof schema.headline !== "string") {
    fail(file, `${schema["@type"]} JSON-LD block ${index} has no headline`)
  }
}

async function validateFile(file) {
  htmlFiles += 1
  const html = await readFile(file, "utf8")
  const matches = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]

  if (matches.length === 0) {
    fail(file, "no application/ld+json block found")
    return
  }

  jsonLdBlocks += matches.length
  matches.forEach((match, index) => {
    try {
      validateSchema(file, JSON.parse(match[1]), index + 1)
    } catch (error) {
      fail(file, `JSON-LD block ${index + 1} is invalid JSON: ${error.message}`)
    }
  })
}

try {
  const rootStats = await stat(SITE_ROOT)
  if (!rootStats.isDirectory()) throw new Error("site is not a directory")
  await walk(SITE_ROOT.pathname)
} catch (error) {
  console.error(`JSON-LD validation failed: ${error.message}`)
  console.error("Run `npx quartz build` before running this validator.")
  process.exit(1)
}

if (errors.length > 0) {
  console.error(`JSON-LD validation failed: ${errors.length} error(s) across ${htmlFiles} HTML file(s).`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`JSON-LD validation passed: ${jsonLdBlocks} block(s) across ${htmlFiles} HTML file(s).`)
