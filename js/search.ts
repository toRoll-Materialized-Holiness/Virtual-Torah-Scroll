import data from "../data/scrolls.json"
import { storageAvailable } from "./localStorage"

type ScrollAttribute = keyof (typeof data)[0]

const scrolls = data
const noResultsDiv = document.querySelector("#no_results")

const activeFilter: Map<ScrollAttribute, string[]> = new Map()
let filteredScrolls: string[] = []
let lastSearchValue = ""

/**
 * Updates and manages the activeFilter map by adding or removing filter values associated with a specified filter field.
 * If the filter value is already present, it is removed. Otherwise, it is added. If no filter values remain for a field, the field is removed from the map.
 * The method also updates the scroll elements to reflect the current state of active filters.
 *
 * @param {ScrollAttribute} filterField - The attribute or field by which the scroll items are being filtered.
 * @param {string} filterValue - The specific value to be added or removed from the filter list for the given filter field.
 * @return {void} This method does not return a value but modifies the global `activeFilter` map and triggers visual updates.
 */
window.filterScroll = function filterScroll(
  filterField: ScrollAttribute,
  filterValue: string,
): void {
  if (activeFilter.has(filterField)) {
    const entry = activeFilter.get(filterField)!
    if (entry.indexOf(filterValue) === -1) {
      entry.push(filterValue)
    } else {
      entry.splice(entry.indexOf(filterValue), 1)

      if (entry.length === 0) activeFilter.delete(filterField)
    }
  } else {
    activeFilter.set(filterField, [filterValue])
  }

  console.log(activeFilter)
  updateScrolls()
}

/**
 * Updates the scroll view based on the specified search value.
 *
 * @param {string} searchValue - The value to search and update the scrolls.
 * @return {void} This function does not return anything.
 */
window.searchScroll = function searchScroll(searchValue: string): void {
  lastSearchValue = searchValue

  updateScrolls()
}

/**
 * Updates the visibility of scroll elements based on active filters and search queries.
 * Filters the collection of scrolls by checking against active filters and search criteria,
 * and manages the visibility of DOM elements representing the scrolls accordingly.
 *
 * @return {void} This method does not return a value.
 */
function updateScrolls(): void {
  filteredScrolls = []

  for (const scroll of scrolls) {
    let include = true
    for (const filter of activeFilter.keys()) {
      const field = scroll[filter]

      if (field === undefined) {
        include = false
        continue
      }

      if (!Array.isArray(field)) {
        if (!activeFilter.get(filter)!.some((val) => field === val)) {
          include = false
        }
      } else {
        if (!activeFilter.get(filter)!.some((val) => field.includes(val))) {
          include = false
        }
      }
    }

    if (lastSearchValue !== "") {
      if (!scroll.title.toLowerCase().includes(lastSearchValue.toLowerCase())) {
        include = false
      }
    }

    if (include) {
      filteredScrolls.push(scroll.id)
    }
  }

  for (const scroll in scrolls) {
    const scrollCard = document.getElementById(scrolls[scroll]["id"])
    scrollCard?.classList.remove("visually-hidden")

    if (
      (activeFilter.size > 0 || lastSearchValue !== "") &&
      !filteredScrolls.includes(scrolls[scroll]["id"])
    ) {
      scrollCard?.classList.add("visually-hidden")
    }
  }

  if (
    (activeFilter.size > 0 || lastSearchValue !== "") &&
    filteredScrolls.length === 0
  ) {
    noResultsDiv?.classList.remove("visually-hidden")
  } else {
    noResultsDiv?.classList.add("visually-hidden")
  }

  console.log(filteredScrolls)
}

/**
 * Navigates to the scroll analysis page, passing the selected scrolls as query parameters.
 *
 * @return {void} Does not return a value. The method performs side effects, such as storing data and redirecting to a new page.
 */
window.analyzeScrolls = function analyzeScrolls(): void {
  const checkboxes = document.querySelectorAll(
    ".form-imagecheck-input",
  ) as NodeListOf<HTMLInputElement>
  const selectedScrolls = []

  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      selectedScrolls.push(checkbox.value)
    }
  }

  let url = "./scroll.html"

  if (storageAvailable("localStorage")) {
    localStorage.setItem("selectedScrolls", JSON.stringify(selectedScrolls))
  } else {
    if (selectedScrolls.length > 0) {
      url = url + "?ids=" + selectedScrolls.join(",")
    }
  }

  location.href = url
}

/**
 * Deselects all scrolls in the dashboard by unchecking their corresponding checkboxes.
 *
 * @return {void} This method does not return a value.
 */
window.deselectAll = function deselectAll(): void {
  const checkboxes = document.querySelectorAll(
    ".form-imagecheck-input",
  ) as NodeListOf<HTMLInputElement>

  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      checkbox.checked = false
    }

    checkbox.dispatchEvent(new Event("change"))
  }
}

/**
 * Selects all scrolls in the dashboard by checking their corresponding checkboxes.
 *
 * @return {void} This method does not return a value.
 */
window.selectAll = function selectAll(): void {
  const checkboxes = document.querySelectorAll(
    ".scroll:not(.visually-hidden) .form-imagecheck-input",
  ) as NodeListOf<HTMLInputElement>

  for (const checkbox of checkboxes) {
    if (!checkbox.checked) {
      checkbox.checked = true
    }

    checkbox.dispatchEvent(new Event("change"))
  }
}
