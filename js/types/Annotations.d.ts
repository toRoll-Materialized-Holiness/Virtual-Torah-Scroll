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

export type AnnotationFile = {
  // Only contains properties required in the code
  ms_id: string
  annos: Annotation[]
}[]

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
