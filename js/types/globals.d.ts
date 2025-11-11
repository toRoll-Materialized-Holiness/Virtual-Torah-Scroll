import type data from "./data/scrolls.json"
import { AnnotationFile } from "./Annotations"

type AppState = {
  currentChapterIndex: number
  chapters: HTMLElement[]
  teiHTML: DocumentFragment
  anno_json: AnnotationFile
  current_book: string
  scrolls: typeof data
}

export declare global {
  interface Window extends Record<string, unknown> {
    appstate: AppState
  }
}
