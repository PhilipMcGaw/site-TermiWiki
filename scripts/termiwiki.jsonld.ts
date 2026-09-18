import { h } from "preact"
import type { QuartzComponent, QuartzComponentProps } from "./quartz/components/types"
import type { QuartzPluginData } from "./quartz/plugins/vfile"

type JsonLd = Record<string, unknown>

type HastNode = {
  type?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
  value?: string
}

const PROFILE_HOSTS = new Set([
  "github.com",
  "gitlab.com",
  "linkedin.com",
  "medium.com",
  "mastodon.social",
  "x.com",
  "twitter.com",
  "facebook.com",
])

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const string = asString(item)
    return string ? [string] : []
  })
}

function pageUrl(baseUrl: string, slug: string | undefined): string {
  const base = `https://${baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  return !slug || slug === "index" ? `${base}/` : `${base}/${slug}`
}

function externalLinks(tree: unknown): string[] {
  const links = new Set<string>()
  const visit = (node: unknown): void => {
    if (typeof node !== "object" || node === null) return
    const element = node as HastNode
    if (element.type === "element" && element.tagName === "a" && typeof element.properties?.href === "string") {
      if (/^https?:\/\//.test(element.properties.href)) links.add(element.properties.href)
    }
    for (const child of element.children ?? []) visit(child)
  }
  visit(tree)
  return [...links]
}

function profileLinks(links: string[]): string[] {
  return links.filter((link) => {
    try {
      const hostname = new URL(link).hostname.replace(/^www\./, "")
      return [...PROFILE_HOSTS].some((host) => hostname === host || hostname.endsWith(`.${host}`))
    } catch {
      return false
    }
  })
}

function serialise(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

function schemaForPage(fileData: QuartzPluginData, baseUrl: string, links: string[]): JsonLd | undefined {
  const slug = fileData.slug
  if (!slug || slug === "404") return undefined

  const frontmatter = fileData.frontmatter ?? {}
  const title = asString(frontmatter.title)
  if (!title) return undefined

  const url = pageUrl(baseUrl, slug)
  const description =
    asString(frontmatter.socialDescription) ?? asString(frontmatter.description) ?? asString(fileData.description)
  const tags = asStringArray(frontmatter.tags)
  const site: JsonLd = {
    "@type": "WebSite",
    "@id": `${pageUrl(baseUrl, "index")}#website`,
    name: "TermiSoc: A WikiHistory",
    url: pageUrl(baseUrl, "index"),
    inLanguage: "en-GB",
  }

  if (slug === "index") {
    return { ...site, "@context": "https://schema.org" }
  }

  if (slug.startsWith("TermiPeople/")) {
    const sameAs = [...new Set([...asStringArray(frontmatter.sameAs), ...profileLinks(links)])]
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${url}#person`,
      name: title,
      url,
      ...(description ? { description } : {}),
      ...(sameAs.length > 0 ? { sameAs } : {}),
      mainEntityOfPage: { "@id": url },
      isPartOf: { "@id": site["@id"] },
    }
  }

  const isCollection = slug.startsWith("tags/") || slug.endsWith("/index")
  return {
    "@context": "https://schema.org",
    "@type": isCollection ? "CollectionPage" : "Article",
    "@id": `${url}#${isCollection ? "collection" : "article"}`,
    headline: title,
    url,
    ...(description ? { description } : {}),
    ...(tags.length > 0 ? { keywords: tags.join(", ") } : {}),
    ...(links.length > 0 ? { citation: links } : {}),
    isPartOf: { "@id": site["@id"] },
    inLanguage: "en-GB",
  }
}

/**
 * Emits conservative per-page Schema.org JSON-LD as a Quartz component.
 *
 * It cannot be injected into Quartz's transformed Markdown tree: that tree is
 * converted to Preact, which escapes or removes script content. Rendering this
 * component directly retains valid JSON in a script element. JSON-LD scripts
 * are valid in the document body as well as the head.
 */
export const TermiWikiJsonLd: QuartzComponent = ({ fileData, cfg, tree }: QuartzComponentProps) => {
  const schema = schemaForPage(fileData, cfg.baseUrl ?? "", externalLinks(tree))
  if (!schema) return null

  return h("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: serialise(schema) },
  })
}
