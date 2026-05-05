import "./annotationCard"

/**
 * Highlights the scroll text based on the provided annotations.
 *
 * @param {Array} sorted_annos - The array of sorted annotation data
 * @param {string[]} selectedscrolls - An array of strings representing the currently selected scrolls
 * @return {void} This method does not return a value. It modifies the DOM by adding highlight spans and adjusts styles and attributes based on annotations.
 */
export function highlightText(
  sorted_annos: [[string, number, number], string[], string][],
  selectedscrolls: string[],
): void {
  let maxAnnosPerSpotSelected = 0

  sorted_annos.forEach((arraylength) => {
    if (arraylength[1].length > maxAnnosPerSpotSelected) {
      maxAnnosPerSpotSelected = arraylength[1].length
    }
  })

  // We process annotations in descending order of start offset
  // to avoid interfering ranges within the same element.
  const annos = [...sorted_annos].sort(
    (a, b) => b[0][1] - a[0][1],
  )
  // create highlight divs only for selected scrolls
  for (const elem in annos) {
    const anno_selector = annos[elem][0]
    const anno_element = anno_selector[0]
    const start = anno_selector[1]
    const length = anno_selector[2]
    const selector_id = anno_selector + ""

    const container = document.getElementById(anno_element)
    if (!container) continue

    // Find the first text node inside the element
    const textNode = container.firstChild
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) continue

    const textContent = textNode.textContent ?? ""

    // Convert to Unicode‑safe character array
    const chars = Array.from(textContent)

    const range = document.createRange()
    range.setStart(textNode, chars.slice(0, start - 1).join("").length)
    range.setEnd(
      textNode,
      chars.slice(0, start - 1 + length).join("").length,
    )

    const span = document.createElement("span")
    span.className = "highlight"
    span.dataset.selectedscrolls = selectedscrolls.join(",")
    span.setAttribute("data-bs-toggle", "tabs")
    span.setAttribute("data-bs-target", "#annotationcard_col")
    span.id = selector_id
    span.onclick = () =>
      openAnnoCard(span, span.dataset.selectedscrolls)

    range.surroundContents(span)

    const opacity = annos[elem][1].length / maxAnnosPerSpotSelected
    if (opacity != null) {
      const percentage = opacity * 100 + "%"
      const inversePercentage = (1 - opacity) * 100 + "%"
      span.style.backgroundColor =
        `color-mix(in hsl, #20e82a ${percentage}, #98fa9d44 ${inversePercentage})`
    }
  }
}
