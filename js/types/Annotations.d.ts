/**
 * Type of a single annotation on some letter in a specific manuscript.
 */
export type Annotation = {
  anno_id: string
  xml_selector: [string, number, number]
  vocab_term: string
  text_id: string
  image: string
  local_image: string

  // Added in code
  chapter?: string
}

/**
 * Typing for a single annotation file in JSON format
 */
export type AnnotationFile = {
  // Only contains properties required in the code
  ms_id: string
  annos: Annotation[]
}[]

/**
 * Typing for a material annotation file in JSON format
 */
export type MaterialAnnotation = {
  anno_id: string
  ink_type: string
  ink_batch: string
  images: string[]
  measurement: {
    data: {
      x: string
      y: number
    }[]
  }
}
