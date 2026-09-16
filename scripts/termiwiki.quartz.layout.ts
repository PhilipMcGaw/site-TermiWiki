import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import type { QuartzComponent } from "./quartz/components/types"

const TermiWikiHead: QuartzComponent = (props) => {
  const Head = Component.Head()

  return (
    <>
      <Head {...props} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body[data-slug^="TermiPeople/"] .popover-hint img {
              float: right;
              width: 280px;
              max-width: 40%;
              height: auto;
              margin: 0 0 1rem 1.5rem;
            }

            @media (max-width: 700px) {
              body[data-slug^="TermiPeople/"] .popover-hint img {
                float: none;
                display: block;
                width: auto;
                max-width: 100%;
                margin: 1rem auto;
              }
            }
          `,
        }}
      />
    </>
  )
}

export const sharedPageComponents: SharedLayout = {
  head: TermiWikiHead,
  header: [],
  afterBody: [],
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
