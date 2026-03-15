import { Annotation, AnnotationFile } from "../types/Annotations"
import { Scroll } from "../types/Scrolls"

/**
 * adds information to the data, which is needed for the diagram creation. Clones the given data in advance
 */
export function manipulateData(data: AnnotationFile[number]) {
  const newData = structuredClone(data)
  newData.annos = newData.annos.map((anno) => addChapterInfo(anno))
  return newData
}

/**
 * adds information about the chapter the annotation is located in to the annotation data
 */
function addChapterInfo(annotationData: Annotation) {
  const $ele = document.getElementById(annotationData.xml_selector[0])!
  // findParentDivNumber is defined in utils/dom to avoid a circular dependency, re-implement minimal logic here
  let parent: HTMLElement | null = $ele
  while (parent && parent.parentElement) {
    parent = parent.parentElement as HTMLElement
    if (parent.nodeName === "TEI-DIV" && parent.getAttribute("n")) {
      annotationData.chapter = parent.getAttribute("n") ?? undefined
      return annotationData
    }
  }
  return annotationData
}

/** counts the number of annotations per chapter */
export function countAnnosPerChapter(
  data: Omit<AnnotationFile[number], "ms_id">,
  chapternumber: string,
) {
  return data.annos.filter((anno) => anno.chapter === chapternumber).length
}

/** merges the annotation data of all manuscripts into one array */
export function mergeAnnoData(data: AnnotationFile) {
  const mergedData: { annos: Annotation[] } = { annos: [] }
  data.forEach((manuscriptData) => {
    manuscriptData.annos.forEach((anno) => {
      mergedData.annos.push(anno)
    })
  })
  return mergedData
}

/** gets the title of a manuscript based on the id of a manuscript. */
export function mapMsIdtoMsName(manuscriptId: string, scrolls: Scroll[]) {
  const title = scrolls.filter((manuscript) => manuscript.id === manuscriptId)[0]?.title
  return title ? title : "unknown"
}
