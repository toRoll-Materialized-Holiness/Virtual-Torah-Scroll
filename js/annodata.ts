import { AnnotationFile } from "./types/Annotations"

export async function loadAnnos(current_book: string) {
  const response = await fetch("/" + current_book + ".json")
  if (response.ok) {
    return await response.json()
  } else {
    throw new Error("Error loading anno json:" + response.statusText)
  }
}

function getAnnosForManuscripts(
  allAnnos: AnnotationFile,
  selectedscrolls: string[],
) {
  const selectedAnnos = []
  for (const item in allAnnos) {
    // only select annos which stem from the selected scrolls
    if (selectedscrolls.includes(allAnnos[item].ms_id)) {
      const anno_list = allAnnos[item].annos
      for (const anno in anno_list) {
        const new_entry: [[string, number, number], string[], string] = [
          anno_list[anno].xml_selector,
          [anno_list[anno].anno_id],
          anno_list[anno].vocab_term,
        ]
        selectedAnnos.push(new_entry)
      }
    }
  }
  return selectedAnnos
}

type Annos = ReturnType<typeof getAnnosForManuscripts>

function sortAnnos1(unsorted_annos: Annos) {
  //sort and reverse anno array to get the right span creation order (console.log will always display the final array!)
  const sorted_annos = unsorted_annos.sort()
  sorted_annos.reverse()

  // Check for annotations on same letter
  // Switch to string instead of selector array??
  for (let i = 0; i < sorted_annos.length - 1; i++) {
    if (
      sorted_annos[i][0][0] === sorted_annos[i + 1][0][0] &&
      sorted_annos[i][0][1] === sorted_annos[i + 1][0][1]
    ) {
      sorted_annos[i][1] = sorted_annos[i][1].concat(sorted_annos[i + 1][1])
      sorted_annos.splice(i + 1, 1)
      i = i - 1
    }
  }

  return sorted_annos
}

/**
 * wrapper to filter annotation data and prepare the formant necessary for highlighting
 * the annotation targets. Calls getAnnosForManuscripts and sortAnnos1.
 *
 * @param {JSON} annotations contains annotations per manuscript
 * @param {[JSON]} selectedscrolls holds information about the scrolls
 * @returns
 */
export function prepareAnnosForHighlighting(
  annotations: AnnotationFile,
  selectedscrolls: string[],
) {
  const unsorted_annos = getAnnosForManuscripts(annotations, selectedscrolls)
  return sortAnnos1(unsorted_annos)
}
