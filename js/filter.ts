import { terms } from "../data/terms.json"
import { AnnotationFile } from "./types/Annotations"
import { renderEverything } from "./scroll"
import { createDisclosureToggle } from "./utils/dom"
import icons from "@toroll/tagin-icons"

/**
 * builds a filter list and attaches eventListeners needed for filtering to the DOM
 *
 * @param $filterContainer container of the filter related Elements
 * @param annotations contains annotations per manuscript
 */
export function initializeFilter(
  $filterContainer: HTMLElement,
  annotations: AnnotationFile,
) {
  // emptying the checkbox container to remove old checkboxes, which
  // might not be available for another book. This also "unchecks" all
  // previsouly checked checkboxes (selected filters)
  $filterContainer.querySelector("#checkboxContainer")!.innerHTML = ""
  // disable the apply filter button by default, it can be enabled by
  // checking a checkbox (selecting a filter)
  $filterContainer.querySelector<HTMLButtonElement>("#applyFilter")!.disabled =
    true

  createCheckboxes($filterContainer, annotations)

  $filterContainer
    .querySelector("#applyFilter")!
    .addEventListener("click", function () {
      applyFilter($filterContainer)
    })
  $filterContainer
    .querySelector("#resetFilter")!
    .addEventListener("click", function () {
      // just rerender the text, highlighting and diagrams to remove the filter
      renderEverything(
        window.appstate.scrolls,
        window.appstate.anno_json,
        window.appstate.teiHTML,
        document.getElementById("content")!,
        document.getElementById("summaryChart")!,
        document.getElementById("distributionChart")!,
        window.appstate.currentChapterIndex,
      )
      uncheckCheckboxes($filterContainer)
      $filterContainer.querySelector<HTMLButtonElement>(
        "#applyFilter",
      )!.disabled = true
    })
}

type CheckboxEvent = Event & { target: HTMLInputElement }

/**
 * Handles the state change of a term checkbox and propagates changes
 * to related subfilter checkboxes.
 *
 * @param {HTMLElement} $filterContainer The container element within which the checkboxes are located.
 * @param {CheckboxEvent} event - The checkbox change event that triggers this handler.
 * @return {void} This function does not return any value.
 */
function handleTermCheckbox(
  $filterContainer: HTMLElement,
  event: CheckboxEvent,
): void {
  const term = event.target.dataset.term

  if (!event.target.checked) {
    $filterContainer
      .querySelectorAll<HTMLInputElement>(
        `.anno-subfilter-checkbox:checked[data-term=${term}]`,
      )
      .forEach((el) => (el.checked = false))
  } else {
    $filterContainer
      .querySelectorAll<HTMLInputElement>(
        `.anno-subfilter-checkbox:not(:checked):not(:disabled)[data-term=${term}]`,
      )
      .forEach((el) => (el.checked = true))
  }
}

/**
 * Handles the behavior of a subterm checkbox, updating the state of its parent term checkbox
 * based on the checked state and the states of sibling subterm checkboxes.
 *
 * @param $filterContainer The container element that holds the filter checkboxes.
 * @param event The checkbox event containing information about the triggered subterm checkbox.
 * @return {void}
 */
function handleSubtermCheckbox(
  $filterContainer: HTMLElement,
  event: CheckboxEvent,
): void {
  const term = event.target.dataset.term

  const parent = $filterContainer.querySelector<HTMLInputElement>(
    `.anno-filter-checkbox[data-term=${term}]:not([data-subterm])`,
  )!

  if (!event.target.checked) {
    const activeSiblings = $filterContainer.querySelectorAll(
      `.anno-subfilter-checkbox:checked[data-term=${term}]`,
    ).length

    if (parent.checked && activeSiblings > 0) {
      parent.indeterminate = true
    } else {
      parent.checked = false
      parent.indeterminate = false
    }
  } else {
    const activeSiblings = $filterContainer.querySelectorAll(
      `.anno-subfilter-checkbox:checked[data-term=${term}]`,
    ).length
    const siblings = $filterContainer.querySelectorAll(
      `.anno-subfilter-checkbox:not(:disabled)[data-term=${term}]`,
    ).length

    if (activeSiblings === siblings) {
      parent.checked = true
      parent.indeterminate = false
    } else {
      parent.checked = true
      parent.indeterminate = true
    }
  }
}

/**
 * callback for every checkbox to enable/disable the button to apply filters.
 * The button to apply filters should only be enabled when at least one checkbox is checked (/a filter is
 * selected). This prevents users from applying an empty filter that would hide all annotations.
 * @param $filterContainer contains the filter bar
 */
function toggleApplyButton($filterContainer: HTMLElement) {
  const $applyButton =
    $filterContainer.querySelector<HTMLButtonElement>("#applyFilter")!
  const filtersSelected = [...$filterContainer.querySelectorAll("input")].some(
    ($input) => $input.checked,
  )
  $applyButton.disabled = !filtersSelected
}

/**
 * creates a tree structure for available classifications in the annotation data and appends the elements
 * to the filterContainer.
 * - [ ] alef
 *   - [ ] alef_1000
 *   - [ ] alef_1100
 * selecting the parent includes all children, selecting individual children does not include
 * other children/parent
 *
 * @param $filterContainer container of the filter related Elements
 * @param annotations contains annotations per manuscript
 */
function createCheckboxes(
  $filterContainer: HTMLElement,
  annotations: AnnotationFile,
) {
  const termSet = new Set<string>()
  const usedTermsSet = new Set<string>()
  const termStruct: Record<string, Record<string, Record<string, unknown>>> = {}

  for (const term of terms) {
    termSet.add(term)
  }

  for (const annotationList of annotations) {
    for (const annotation of annotationList.annos) {
      usedTermsSet.add(annotation.vocab_term)
    }
  }

  for (const term of termSet) {
    const parts = term
      .split("_")
      .map((str) => str.replaceAll(/[^A-Za-z0-9]/g, ""))

    if (parts.length > 0 && !(parts[0] in termStruct)) {
      termStruct[parts[0]] = {}
    }

    if (parts.length > 1 && !(parts[1] in termStruct[parts[0]])) {
      termStruct[parts[0]][parts[1]] = {}
    }
  }

  // Create Checkboxes for each term
  for (const term of Object.keys(termStruct)) {
    const el = document.createElement("div")
    el.classList.add("anno-filter")
    el.dataset.term = term
    el.dataset.disabled = "true"

    const label = document.createElement("label")
    label.htmlFor = `${term}`
    label.classList.add("anno-filter-label")
    label.innerText = term
    el.append(label)

    const { checkbox: subfilterOpenCheckbox, label: subfilterOpenLabel } =
      createDisclosureToggle(
        `subfilter-open.${term}`,
        ["anno-filter-open"],
        ["anno-filter-open-label"],
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
      )

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.classList.add("anno-filter-checkbox")
    checkbox.dataset.term = term
    checkbox.onchange = (e) => {
      handleTermCheckbox($filterContainer, e as CheckboxEvent)
      toggleApplyButton($filterContainer)
    }
    checkbox.id = term
    checkbox.disabled = true

    el.prepend(checkbox)
    el.prepend(subfilterOpenLabel)
    el.prepend(subfilterOpenCheckbox)

    // Create Checkboxes for subterms
    const subterms = Object.keys(termStruct[term])
    for (const sub of subterms) {
      const subEl = document.createElement("div")
      subEl.dataset.term = term
      subEl.dataset.subterm = sub
      subEl.classList.add("anno-filter", "anno-subfilter")
      subEl.dataset.disabled = "true"

      const label = document.createElement("label")
      label.htmlFor = `${term}_${sub}`
      label.classList.add("anno-filter-label")
      label.innerText = sub

      const term_thumb = document.createElement("img")
      //term_thumb.src = `./term_placeholder/${term}_${sub}.png`
      term_thumb.src = icons[term + "_" + sub]
      term_thumb.classList.add("anno-filter-thumb")
      term_thumb.width = 30
      term_thumb.setAttribute(
        "onerror",
        "this.onerror=null; this.src='./term_placeholder/image-off.png'; this.style='opacity:0.3';",
      )
      subEl.append(term_thumb, label)

      const checkbox = document.createElement("input")
      checkbox.classList.add("anno-filter-checkbox", "anno-subfilter-checkbox")
      checkbox.dataset.term = term
      checkbox.dataset.subterm = sub
      checkbox.type = "checkbox"
      checkbox.id = `${term}_${sub}`
      checkbox.onchange = (e) => {
        handleSubtermCheckbox($filterContainer, e as CheckboxEvent)
        toggleApplyButton($filterContainer)
      }
      checkbox.disabled = true
      subEl.prepend(checkbox)

      el.append(subEl)
    }

    $filterContainer.querySelector("#checkboxContainer")!.append(el)
  }

  for (const usedTerm of usedTermsSet) {
    const parts = usedTerm.split("_")
    if (parts.length >= 1) {
      const target = $filterContainer.querySelector<HTMLInputElement>(
        `.anno-filter[data-term="${parts[0]}"]`,
      )!
      if (!target) console.warn(`No filter for term ${usedTerm} exists`)
      else target.dataset.disabled = "false"

      const targetCheckbox = $filterContainer.querySelector<HTMLInputElement>(
        `.anno-filter-checkbox[data-term="${parts[0]}"]`,
      )!
      if (targetCheckbox) targetCheckbox.disabled = false
    }
    if (parts.length >= 2) {
      const target = $filterContainer.querySelector<HTMLInputElement>(
        `.anno-subfilter[data-term="${parts[0]}"][data-subterm="${parts[1]}"]`,
      )!
      if (!target) console.warn(`No filter for term ${usedTerm} exists`)
      else target.dataset.disabled = "false"

      const targetCheckbox = $filterContainer.querySelector<HTMLInputElement>(
        `.anno-filter-checkbox[data-term="${parts[0]}"][data-subterm="${parts[1]}"]`,
      )!
      if (targetCheckbox) targetCheckbox.disabled = false
    }
  }
}

/**
 * get all classifications selected by the user
 *
 * @param $filterContainer container of the filter related Elements
 * @returns list of values of selected checkboxes (i.e. classifications selected by a user)
 */
function getSelectedClassifications($filterContainer: HTMLElement) {
  return [
    ...$filterContainer.querySelectorAll<HTMLInputElement>(
      "input.anno-filter-checkbox:checked:not(:disabled):not(:indeterminate)",
    ),
  ].map((el) => {
    const term = el.dataset.term
    const subterm = el.dataset.subterm

    if (subterm) {
      return `${term}_${subterm}`
    } else {
      return term
    }
  })
}

/**
 * uncheck all inputs/checkboxes of the filterContainer
 *
 * @param $filterContainer container of the filter related Elements
 */
function uncheckCheckboxes($filterContainer: HTMLElement) {
  $filterContainer
    .querySelectorAll<HTMLInputElement>("input.anno-filter-checkbox:checked")
    .forEach((el) => {
      el.checked = false
    })

  $filterContainer
    .querySelectorAll<HTMLInputElement>(
      "input.anno-filter-checkbox:indeterminate",
    )
    .forEach((el) => {
      el.checked = false
      el.indeterminate = false
    })
}

/**
 * filters the annotations based on the classifications selected by a user (via the checkboxes
 * in the filterContainer) and renders text, annotation highlights and diagrams accordingly
 *
 * @param $filterContainer container of the filter elements
 */
function applyFilter($filterContainer: HTMLElement) {
  const activeFilters = getSelectedClassifications($filterContainer)
  console.log(activeFilters)
  const filteredAnnos = window.appstate.anno_json.map((manuscript) => {
    return {
      ms_id: manuscript.ms_id,
      annos: manuscript.annos.filter((anno) =>
        activeFilters.includes(anno.vocab_term),
      ),
    }
  })
  renderEverything(
    window.appstate.scrolls,
    filteredAnnos,
    window.appstate.teiHTML,
    document.getElementById("content")!,
    document.getElementById("summaryChart")!,
    document.getElementById("distributionChart")!,
    window.appstate.currentChapterIndex,
  )
}
