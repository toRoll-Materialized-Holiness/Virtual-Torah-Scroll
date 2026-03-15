/** DOM-related utility helpers */

/** get numbers of the chapters available for one text */
export function getAvailableChapterNumbers($text: HTMLElement) {
  return [...$text.querySelectorAll("tei-div[type='chapter']")].map(($ele) =>
    $ele.getAttribute("n"),
  )
}

/**
 * Creates a checkbox + label pair used to toggle (disclose) a collapsible section via CSS.
 * Returns both elements so callers can prepend/append as needed.
 */
export function createDisclosureToggle(
  id: string,
  checkboxClasses: string[],
  labelClasses: string[],
  svgInnerHTML: string,
) {
  const $checkbox = document.createElement("input")
  $checkbox.type = "checkbox"
  $checkbox.classList.add(...checkboxClasses)
  $checkbox.classList.add("visually-hidden")
  $checkbox.id = id

  const $label = document.createElement("label")
  $label.classList.add(...labelClasses)
  $label.htmlFor = id
  $label.innerHTML = svgInnerHTML

  return { checkbox: $checkbox, label: $label }
}
