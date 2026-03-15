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
  // create highlight divs only for selected scrolls
  for (const elem in sorted_annos) {
    const anno_selector = sorted_annos[elem][0]
    const anno_element = anno_selector[0]
    const start = anno_selector[1]
    const length = anno_selector[2]
    const selector_id = anno_selector
    let str = document.getElementById(anno_element + "")!.innerHTML
    str =
      str.substring(0, start - 1) +
      '<span class="highlight" onclick="openAnnoCard(this, this.dataset.selectedscrolls)" data-selectedscrolls="' +
      selectedscrolls +
      '" data-bs-toggle="tabs" data-bs-target="#annotationcard_col" id="' +
      selector_id +
      '">' +
      str.substring(start - 1, length + start - 1) +
      "</span>" +
      str.substring(start - 1 + length)
    document.getElementById(anno_element)!.innerHTML = str
    const opacity = sorted_annos[elem][1].length / maxAnnosPerSpotSelected
    if (opacity != null) {
      const percentage = opacity * 100 + "%"
      const inversePercentage = (1 - opacity) * 100 + "%"
      document.getElementById(selector_id + "")!.style.backgroundColor =
        `color-mix(in hsl, #20e82a ${percentage}, #98fa9d44 ${inversePercentage})`
    }
  }
}
