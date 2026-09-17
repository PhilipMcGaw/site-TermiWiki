import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import type { QuartzComponent } from "./quartz/components/types"

const TermiWikiStyles: QuartzComponent = () => null
TermiWikiStyles.css = `
  /*
   * TermiSoc c.2006 visual reconstruction.
   *
   * This is deliberately an evidence-led period style rather than an exact
   * reproduction of the original stylesheet. It uses the compact, fixed-width
   * university/society web conventions common in the mid-2000s while retaining
   * Quartz's responsive behaviour and accessibility.
   */
  :root {
    --retro-page-width: 960px;
    --retro-border: #b7b7b7;
    --retro-border-dark: #808080;
    /* Use Quartz's palette for surfaces and text so dark mode remains legible. */
    --retro-panel: var(--lightgray);
    --retro-panel-light: var(--light);
    --retro-link: var(--secondary);
    --retro-visited: var(--tertiary);
    --retro-heading: var(--secondary);
    --retro-text: var(--darkgray);
  }

  html {
    background: var(--lightgray);
  }

  body {
    background: var(--lightgray);
    color: var(--retro-text);
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-size: 13px;
    line-height: 1.45;
  }

  #quartz-root {
    max-width: var(--retro-page-width);
    margin: 0 auto;
    background: var(--light);
    border-left: 1px solid var(--retro-border-dark);
    border-right: 1px solid var(--retro-border-dark);
    min-height: 100vh;
  }

  #quartz-body {
    gap: 0.75rem;
    padding: 0.75rem 1rem 1.5rem;
  }

  .page-header {
    margin: 0 0 0.75rem;
    padding-bottom: 0.45rem;
    border-bottom: 1px solid var(--retro-border-dark);
  }

  .popover-hint {
    max-width: none;
  }

  .popover-hint h1,
  .popover-hint h2,
  .popover-hint h3,
  .popover-hint h4,
  .popover-hint h5,
  .popover-hint h6 {
    color: var(--retro-heading);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    line-height: 1.2;
  }

  .popover-hint h1 {
    font-size: 1.55rem;
    margin: 0.3rem 0 0.8rem;
  }

  .popover-hint h2 {
    font-size: 1.25rem;
    border-bottom: 1px solid var(--retro-border);
    padding-bottom: 0.15rem;
  }

  .popover-hint h3 {
    font-size: 1.05rem;
  }

  a {
    color: var(--retro-link);
    text-decoration: underline;
  }

  a:visited {
    color: var(--retro-visited);
  }

  a:hover,
  a:focus {
    text-decoration: underline;
  }

  /* Keep navigation compact and rectangular rather than card-like. */
  .sidebar,
  .explorer,
  .search,
  .backlinks,
  .graph {
    border-radius: 0;
    box-shadow: none;
  }

  .explorer {
    border: 1px solid var(--retro-border);
    background: var(--retro-panel-light);
  }

  .explorer .explorer-content {
    font-size: 0.9rem;
  }

  .search-button,
  button,
  input,
  textarea,
  select {
    border-radius: 0;
  }

  .search-button {
    border: 1px solid var(--retro-border-dark);
    background: var(--retro-panel);
  }

  .page-title {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1.25rem;
    font-weight: bold;
  }

  .tags,
  .tag-link {
    border-radius: 0;
  }

  .tag-link {
    border: 1px solid var(--retro-border);
    background: var(--retro-panel);
    padding: 0.1rem 0.3rem;
    font-size: 0.8rem;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.92rem;
  }

  th,
  td {
    border: 1px solid var(--retro-border);
    padding: 0.3rem 0.45rem;
    vertical-align: top;
  }

  th {
    background: var(--retro-panel);
    text-align: left;
  }

  blockquote {
    border-left: 3px solid var(--retro-border-dark);
    background: var(--retro-panel-light);
    margin-left: 0;
    padding: 0.4rem 0.8rem;
  }

  code,
  pre {
    border-radius: 0;
  }

  pre {
    border: 1px solid var(--retro-border);
  }

  /* Historical person portraits retain the established TermiWiki treatment. */
  body[data-slug^="TermiPeople/"] .popover-hint img {
    float: right;
    width: 280px;
    max-width: 40%;
    height: auto;
    margin: 0 0 1rem 1.5rem;
    border: 1px solid var(--retro-border);
  }

  @media (max-width: 700px) {
    html,
    body {
      background: var(--light);
    }

    #quartz-root {
      width: 100%;
      border: 0;
    }

    #quartz-body {
      padding: 0.5rem;
    }

    body[data-slug^="TermiPeople/"] .popover-hint img {
      float: none;
      display: block;
      width: auto;
      max-width: 100%;
      margin: 1rem auto;
    }
  }
`

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [TermiWikiStyles],
  footer: Component.Footer(),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle(), Component.ContentMeta(), Component.TagList()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [Component.DesktopOnly(Component.TableOfContents()), Component.Backlinks()],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
