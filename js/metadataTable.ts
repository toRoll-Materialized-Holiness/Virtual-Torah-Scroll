import { Scroll } from "./types/Scrolls"
import { Annotation, AnnotationFile } from "./types/Annotations"
import { createDecoratedLetterDiagram } from "./diagrams"
import { createDisclosureToggle } from "./utils/dom"

function tryJoin(str: string | string[]) {
  if (Array.isArray(str)) {
    return str.join(", ")
  } else return str
}

export function createMetadataTable(
  scrolls: Scroll[],
  selectedscrolls: string[],
  data: AnnotationFile,
) {
  for (const selectedscroll in selectedscrolls) {
    for (const scroll in scrolls) {
      if (scrolls[scroll].id == selectedscrolls[selectedscroll]) {
        const metadatatable = document
          .getElementById("metadatatable")!
          .getElementsByTagName("tbody")[0]
        const newRow = metadatatable.insertRow()

        // fill the container div ("card") with scroll facts
        const annotations = data.filter(
          (manuscript) => manuscript.ms_id === scrolls[scroll].id,
        )[0]?.annos
        // total amount of annotations
        const annoCount = annotations ? annotations.length : 0
        // number of distinct classifications
        const usedTermsSet = new Set()
        if (annotations) {
          for (const annotation of annotations) {
            usedTermsSet.add(annotation.vocab_term)
          }
        }

        newRow.innerHTML =
          `<tr><td style='width: 4%'></td><td style='width: 16%'>` +
          scrolls[scroll].title +
          "</td><td style='width: 20%'>" +
          tryJoin(scrolls[scroll].origin) +
          "</td><td style='width: 20%'>" +
          tryJoin(scrolls[scroll].publication_year) +
          "</td><td style='width: 20%'>" +
          tryJoin(scrolls[scroll].script_type) +
          "</td><td style='width: 10%'>" +
          annoCount +
          "</td><td style='width: 10%'>" +
          usedTermsSet.size +
          "</td></tr>"
        createScrollFactsExpandable(
          metadatatable,
          newRow,
          annotations,
          scrolls[scroll],
        )
      }
    }
  }
}
/**
 * create an additional row in the table for a scroll. The row is expandable/collapseable
 * and displays information (scroll facts) about the scroll.
 *
 * @param {Element} $tableBody the body of the table
 * @param {Element} $tableRow a row of the table
 * @param {JSON} annotations contains annotations of the scroll
 * @param {Object} scroll contains information about a scroll
 */
function createScrollFactsExpandable(
  $tableBody: HTMLTableSectionElement,
  $tableRow: HTMLTableRowElement,
  annotations: Annotation[],
  scroll: Scroll,
) {
  // expand/collapse "buttons". They work because the checkbox is hidden, but clicking
  // the label will check the checkbox and then css rules will hide/show
  // the factsRow (which is added later)
  const { checkbox: $factsOpenCheckbox, label: $factsOpenLabel } = createDisclosureToggle(
    `facts-open.${scroll.id}`,
    ["scroll-facts-open"],
    ["scroll-facts-open-label"],
    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  )
  const $firstCell = $tableRow.querySelector("td")!
  $firstCell.appendChild($factsOpenCheckbox)
  $firstCell.appendChild($factsOpenLabel)

  if (annotations) {
    // add new row and container elements, which hold the scroll fact information
    const $factsRow = $tableBody.insertRow()
    $factsRow.classList.add("scroll-facts")
    const $tableDataElement = document.createElement("td")
    $tableDataElement.setAttribute("colspan", "7")
    const $cardDiv = document.createElement("div")
    $cardDiv.classList.add("card")
    const $cardHeader = document.createElement("div")
    $cardHeader.classList.add("card-header")
    const $cardBody = document.createElement("div")
    $cardBody.classList.add("card-body")
    const $headline = document.createElement("h3")
    $headline.classList.add("card-title")
    $headline.innerHTML = "Distribution of decorations per letter"
    $cardHeader.appendChild($headline)
    // annotations per letter visualized in a diagram. Will only be executed,
    // if there are annotations available for a scroll

    const $outerDiv = document.createElement("div")
    $outerDiv.classList.add("tw:h-82")
    const $diagramContainer = document.createElement("div")
    $diagramContainer.classList.add("tw:w-full")
    $diagramContainer.classList.add("tw:h-full")
    $diagramContainer.classList.add("tw:relative")

    createDecoratedLetterDiagram(annotations, $diagramContainer)
    $outerDiv.appendChild($diagramContainer)
    $cardBody.appendChild($outerDiv)

    $cardDiv.appendChild($cardHeader)
    $cardDiv.appendChild($cardBody)
    $tableDataElement.appendChild($cardDiv)
    $factsRow.appendChild($tableDataElement)
  } else {
    $factsOpenCheckbox.disabled = true
    $factsOpenLabel.style.cursor = "not-allowed"
    $factsOpenLabel.style.opacity = "0.4"
  }
}
