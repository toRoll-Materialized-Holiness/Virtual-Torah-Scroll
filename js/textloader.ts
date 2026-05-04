/**
 * fetch HTML converted via CETEIcean beforehand for the specified book
 *
 * @param fileName name of the file
 * @returns $teiHtml holding the tei content
 */
export async function loadBook(fileName: string) {
  const response = await fetch("./" + fileName + ".html")

  if (response.ok) {
    const html = await response.text()
    const temp = document.createElement("template")
    temp.innerHTML = html
    return temp.content
  } else {
    throw new Error("Error loading HTML:" + response.statusText)
  }
}

/**
 * inserts the tei content into the DOM. Use this to get the text w/o any highlights
 *
 * @param $contentDiv container for the tei content
 * @param $teiHtml holding the tei content after CETEIcean converted it to html
 */
export function renderText(
  $contentDiv: HTMLElement,
  $teiHtml: DocumentFragment,
) {
  // Clear previous content
  $contentDiv.innerHTML = ""
  // append the tei fragment to the document. It has to be cloned before appending
  // as appendChild() would empty the tei fragment and we need it later again.
  // See https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild :
  // "the entire contents of the DocumentFragment are moved into the child list of the specified parent node"
  $contentDiv.appendChild($teiHtml.cloneNode(true))
}
