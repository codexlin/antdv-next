import { inject } from 'vue'

export interface Frontmatter {
  title?: string
  subtitle?: string
  description?: string
  tag?: string
  [key: string]: any
}

export interface HeaderItem {
  level: 2
  title: string
  slug: string
  link: string
  children?: HeaderItem[]
}

export interface DocPage {
  frontmatter?: Frontmatter
  title?: string
  headers?: HeaderItem[]
}

export function useDocPage() {
  return inject('__pageData__', {} as DocPage)
}
