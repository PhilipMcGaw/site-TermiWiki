import type { QuartzTransformerPlugin } from "./quartz/plugins/types"
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

function externalLinks(fileData: QuartzPluginData): string[] {
  const links = fileData.externalLinks
  return Array.isArray(links)
    ? links.filter((link): link is string => typeof link === "string" && /^https?:\/\//.test(link))
    : []
}

function profileLinks(links: string[]): string[] {
  return links.filter((link) => {
    try {
      return PROFILE_HOSTS.has(new URL(link).hostname.replace(/^www\./, ""))
    } catch {
      return false
    }
  })
}

function serialise(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

function schemaForPage(fileData: QuartzPluginData, baseUrl: string): JsonLd | undefined {
  const slug = fileData.slug
  if (!slug || slug === "404") return undefined

  const frontmatter = fileData.frontmatter ?? {}
  const title = asString(frontmatter.title)
  if (!title) return undefined

  const url = pageUrl(baseUrl, slug)
  const description =
    asString(frontmatter.socialDescription) ?? asString(frontmatter.description) ?? asString(fileData.description)
  const tags = asStringArray(frontmatter.tags)
  const links = externalLinks(fileData)
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
 * Captures external Markdown links after Quartz has rendered them, then emits
 * conservative per-page Schema.org JSON-LD directly into the transformed HTML.
 *
 * Quartz's `externalResources().additionalHead` is for static head resources;
 * it is not a per-page callback. Injecting the JSON-LD into the transformed
 * HAST tree keeps the data page-specific while avoiding an invalid resource hook.
 * JSON-LD script elements are valid in the document body as well as the head.
 */
export const TermiWikiJsonLd = (baseUrl: string): QuartzTransformerPlugin => () => ({
  name: "TermiWikiJsonLd",
  htmlPlugins() {
    return [
      () => (tree, file) => {
        const links = new Set<string>()
        const visit = (node: unknown): void => {
          if (typeof node !== "object" || node === null) return
          const element = node as HastNode
          if (element.type === "element" && element.tagName === "a" && typeof element.properties?.href === "string") {
            const href = element.properties.href
            if (/^https?:\/\//.test(href)) links.add(href)
          }
          for (const child of element.children ?? []) visit(child)
        }
        visit(tree)
        file.data.externalLinks = [...links]

        const schema = schemaForPage(file.data, baseUrl)
        if (!schema) return

        const root = tree as HastNode
        root.children ??= []
        root.children.push({
          type: "element",
          tagName: "script",
          properties: { type: "application/ld+json" },
          children: [{ type: "text", value: serialise(schema) }],
        })
      },
    ]
  },
})

declare module "vfile" {
  interface DataMap {
    externalLinks?: string[]
  }
}
