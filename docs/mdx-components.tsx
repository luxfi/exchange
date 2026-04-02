import type { MDXComponents } from "mdx/types"
import defaultMdxComponents from "@hanzo/docs-ui/mdx"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
  }
}
