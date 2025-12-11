import { AnnotationFile } from "./types/Annotations"

/**
 * Asynchronously loads annotation data for the specified book.
 *
 * @param {string} current_book - The name of the book whose annotations should be loaded.
 * @return A promise that resolves to the parsed annotation data as a JSON object.
 * @throws {Error} If there is an issue with the HTTP request or response.
 */
export async function loadAnnos(current_book: string) {
  const response = await fetch("/" + current_book + ".json")
  if (response.ok) {
    return await response.json()
  } else {
    throw new Error("Error loading anno json:" + response.statusText)
  }
}

/**
 * Retrieves annotations that correspond to the given selected manuscripts.
 *
 * @param {AnnotationFile} allAnnos - The collection of annotations for all manuscripts.
 * @param {string[]} selectedscrolls - The identifiers of the manuscripts to filter annotations by.
 * @return {Array.<[[string, number, number], string[], string]>} The filtered annotations corresponding to the selected manuscripts. Each entry consists of an XML selector, a list with a single annotation ID, and a vocabulary term.
 */
function getAnnosForManuscripts(
  allAnnos: AnnotationFile,
  selectedscrolls: string[],
): Array<[[string, number, number], string[], string]> {
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

/**
 * Represents the annotations derived from manuscripts using the `getAnnosForManuscripts` function.
 *
 * The `Annos` type is dynamically generated based on the return type of the `getAnnosForManuscripts` method,
 * which integrates the data structure associated with annotations for specific manuscripts.
 *
 * This type is useful for ensuring type safety and consistency when working with annotation-related data
 * produced by the `getAnnosForManuscripts` function.
 */
type Annos = ReturnType<typeof getAnnosForManuscripts>

/**
 * Sorts and processes an array of annotations. The annotations are sorted, reversed,
 * and any annotations on the same letter are merged into one.
 *
 * @param {Annos} unsorted_annos - An array of annotations to be sorted and processed.
 * @return {Annos} A sorted and processed array of annotations where overlapping or
 * concurrent annotations are combined.
 */
function sortAnnos1(unsorted_annos: Annos): Annos {
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
): Annos {
  const unsorted_annos = getAnnosForManuscripts(annotations, selectedscrolls)
  return sortAnnos1(unsorted_annos)
}
