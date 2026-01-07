import data from "../data/scrolls.json"
import { initializeFilter } from "./filter"
import { createMetadataTable } from "./metadataTable"
import { loadAnnos, prepareAnnosForHighlighting } from "./annodata"
import { initializeNavBar, renderNavBar } from "./navigation"
import { loadBook, renderText } from "./textloader"
import "./upButton"
import { AnnotationFile } from "./types/Annotations"
import { Scroll } from "./types/Scrolls"
import { highlightText } from "./highlight"
import { createBarDiagram, createSummaryBarDiagram } from "./diagrams"
import { getSelectedScrolls } from "./localStorage"

/**
 * This is the main script for the scroll page
 */

console.time("initialRender")

// using window variables as openAnnoCard() needs some variables, and to mock a state
// creating empty 'appstate' object at window to keep track of the current state
window.appstate = {
  scrolls: [],
  anno_json: [],
  teiHTML: document.createDocumentFragment(),
  currentChapterIndex: 0,
  chapters: [],
  current_book: "",
}

const teiFiles = document.querySelector<HTMLInputElement>("#teiFiles")!

// using window variables here as openAnnoCard() needs this variable
// checking the value of the select element; using "1_Genesis" as a default
window.appstate.current_book = teiFiles.value ?? "1_Genesis"
// getting scroll data
// using window variable here as openAnnoCard() needs this variable
window.appstate.scrolls = data

// Get ms ids from url and store in array
const selectedscrolls = getSelectedScrolls()

// redirect users back to the dashboard, if no scrolls have been selected.
// This should only happen if the user opens the scroll.html directly in a new
// (incognito) window/tab and therefore, the localStorage doesn't contain a
// selection of scrolls
if (selectedscrolls.length === 0) {
  const confirmation = confirm(
    "No scrolls have been selected. Do you want to go back to the dashboard and select any?",
  )
  if (confirmation) {
    window.location.href = "dashboard.html"
  } else {
    console.warn("No scrolls")
  }
}

// set up the various DOM-elements
teiFiles.addEventListener("change", async function () {
  window.appstate.current_book = this.value
  window.appstate.teiHTML = await loadBook(window.appstate.current_book)
  window.appstate.anno_json = await loadAnnos(window.appstate.current_book)
  initializeFilter(
    document.getElementById("filterContainer")!,
    window.appstate.anno_json.filter((entry) =>
      selectedscrolls.includes(entry.ms_id),
    ),
  )
  renderEverything(
    window.appstate.scrolls,
    window.appstate.anno_json,
    window.appstate.teiHTML,
    document.getElementById("content")!,
    document.getElementById("summaryChart")!,
    document.getElementById("distributionChart")!,
    0,
  )
})

document.getElementById("content")!.dir = "rtl"
initializeNavBar()

// aggregating all data
// getting annotation for genesis
// using window variable here as openAnnoCard() needs this variable
window.appstate.anno_json = await loadAnnos(window.appstate.current_book)
createMetadataTable(
  window.appstate.scrolls,
  selectedscrolls,
  window.appstate.anno_json.filter((entry) =>
    selectedscrolls.includes(entry.ms_id),
  ),
)
initializeFilter(
  document.getElementById("filterContainer")!,
  window.appstate.anno_json.filter((entry) =>
    selectedscrolls.includes(entry.ms_id),
  ),
)

// Load the first file by default
window.appstate.teiHTML = await loadBook(teiFiles.value)
renderEverything(
  window.appstate.scrolls,
  window.appstate.anno_json,
  window.appstate.teiHTML,
  document.getElementById("content")!,
  document.getElementById("summaryChart")!,
  document.getElementById("distributionChart")!,
  0,
)

console.timeEnd("initialRender")

/**
 * wrapper function to render the text, annotation highlights and diagrams
 *
 * @param scrolls holds information about the scrolls
 * @param annotations contains annotations per manuscript
 * @param teiHTML holding the tei content after CETEIcean converted it to html
 * @param $content container for the tei content
 * @param $diagram1 the container for the first diagram (summary diagram)
 * @param $diagram2 the container for the second diagram
 * @param chapterIndex of the chapter that should be displayed after rendering the text
 */
export function renderEverything(
  scrolls: Scroll[],
  annotations: AnnotationFile,
  teiHTML: DocumentFragment,
  $content: HTMLElement,
  $diagram1: HTMLElement,
  $diagram2: HTMLElement,
  chapterIndex: number,
) {
  renderText($content, teiHTML)
  renderNavBar(chapterIndex, annotations)
  const sorted_annos = prepareAnnosForHighlighting(annotations, selectedscrolls)
  highlightText(sorted_annos, selectedscrolls)
  // filter out all annotations, that are not in the scrolls selected by the user
  const selectedScrollsAnnos = annotations.filter((entry) =>
    selectedscrolls.includes(entry.ms_id),
  )
  createSummaryBarDiagram(selectedScrollsAnnos, $content, $diagram1)
  createBarDiagram(selectedScrollsAnnos, scrolls, $content, $diagram2)
}
