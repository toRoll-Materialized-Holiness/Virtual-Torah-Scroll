import data from "../data/scrolls.json"
import { storageAvailable } from "./localStorage"

type ScrollAttribute = keyof (typeof data)[0]

const scrolls = data
const noResultsDiv = document.querySelector("#no_results")

const activeFilter: Map<ScrollAttribute, string[]> = new Map()
let filteredScrolls: string[] = []
let lastSearchValue = ""

window.filterScroll = function filterScroll(
  filterField: ScrollAttribute,
  filterValue: string,
) {
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

window.searchScroll = function searchScroll(searchValue: string) {
  lastSearchValue = searchValue

  updateScrolls()
}

function updateScrolls() {
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

window.analyzeScrolls = function analyzeScrolls() {
  const checkboxes = document.querySelectorAll(
    ".form-imagecheck-input",
  ) as NodeListOf<HTMLInputElement>
  const selectedScrolls = []

  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      selectedScrolls.push(checkbox.value)
    }
  }

  let url = "/scroll.html"

  if (storageAvailable("localStorage")) {
    localStorage.setItem("selectedScrolls", JSON.stringify(selectedScrolls));
  } else {
    if (selectedScrolls.length > 0) {
      url = url + "?ids=" + selectedScrolls.join(",");
    }
  }

  location.href = url
}

window.deselectAll = function deselectAll() {
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

window.selectAll = function selectAll() {
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
