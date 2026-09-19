import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { h } from "preact"

const TermiWikiIconLinks = () => ({
  name: "TermiWikiIconLinks",
  externalResources: () => ({
    additionalHead: [
      h("link", { rel: "shortcut icon", href: "/favicon.ico" }),
      h("link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/static/favicon-16.png" }),
      h("link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/static/favicon-32.png" }),
      h("link", { rel: "apple-touch-icon", sizes: "180x180", href: "/static/apple-touch-icon.png" }),
      h("link", { rel: "manifest", href: "/static/site.webmanifest" }),
      h("meta", { name: "theme-color", content: "#1e1714" }),
    ],
  }),
})

const config: QuartzConfig = {
  configuration: {
    pageTitle: "TermiSoc: A WikiHistory",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    locale: "en-GB",
    baseUrl: "termisoc.skippy.org.uk",
    ignorePatterns: [".obsidian", ".scripts", "Migration Sources"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "git", "filesystem"] }),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      TermiWikiIconLinks(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
