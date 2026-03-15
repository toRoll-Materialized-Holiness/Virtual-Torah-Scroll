import { AnnotationFile } from "./types/Annotations"
import {
  countAnnosPerChapter,
  manipulateData,
  mergeAnnoData,
} from "./utils/annotations"
import { getSelectedScrolls } from "./localStorage"

// Get ms ids from url and store in array
const selectedscrolls = getSelectedScrolls()
/**
 * Displays the current chapter while hiding all other chapters
 * based on the currentChapterIndex in the global app state.
 * Also updates the chapter dropdown to reflect the current chapter.
 *
 * @return {void} This method does not return a value.
 */
export function displayChapter(): void {
  window.appstate.chapters.forEach((chapter, index) => {
    if (index === window.appstate.currentChapterIndex) {
      chapter.classList.remove("visually-hidden")
    } else {
      chapter.classList.add("visually-hidden")
    }
  })

  // Update the chapter dropdown to reflect the current chapter
  document.querySelector<HTMLSelectElement>("#chapterSelect")!.value =
    window.appstate.currentChapterIndex + ""
}

/**
 * Initializes the navigation bar by adding event listeners to various elements
 * for navigating through chapters in the application.
 * Supports navigation to the next, previous, first, or last chapter,
 * as well as selecting a chapter from a dropdown menu.
 *
 * @return {void} Does not return a value.
 */
export function initializeNavBar(): void {
  document
    .getElementById("prevChapter")!
    .addEventListener("click", function () {
      if (window.appstate.currentChapterIndex > 0) {
        window.appstate.currentChapterIndex--
        displayChapter()
      }
    })

  document
    .getElementById("nextChapter")!
    .addEventListener("click", function () {
      if (
        window.appstate.currentChapterIndex <
        window.appstate.chapters.length - 1
      ) {
        window.appstate.currentChapterIndex++
        displayChapter()
      }
    })

  document
    .getElementById("firstChapter")!
    .addEventListener("click", function () {
      if (window.appstate.currentChapterIndex !== 0) {
        window.appstate.currentChapterIndex = 0
        displayChapter()
      }
    })

  document
    .getElementById("lastChapter")!
    .addEventListener("click", function () {
      if (
        window.appstate.currentChapterIndex <
        window.appstate.chapters.length - 1
      ) {
        window.appstate.currentChapterIndex =
          window.appstate.chapters.length - 1
        displayChapter()
      }
    })

  document
    .querySelector<HTMLSelectElement>("#chapterSelect")!
    .addEventListener("change", function () {
      window.appstate.currentChapterIndex = parseInt(this.value)
      displayChapter()
    })
}

/**
 * Populates the chapter dropdown with options representing chapters
 * and their associated annotation count, based on the data filtered by
 * the selected scrolls.
 *
 * @param {AnnotationFile} annotations - The annotation file data used to filter
 * and populate the dropdown with chapters and their annotation count.
 * @return {void} Does not return a value. Side effect is populating the dropdown.
 */
export function populateChapterDropdown(annotations: AnnotationFile): void {
  const chapterSelect = document.getElementById("chapterSelect")!
  chapterSelect.innerHTML = "" // Clear previous options

  // filter out all annotations, that are not in the scrolls selected by the user
  const selectedScrollsAnnos = annotations.filter((entry) =>
    selectedscrolls.includes(entry.ms_id),
  )
  const mergedData = mergeAnnoData(selectedScrollsAnnos)
  const dataWithChapterNumbers = manipulateData({
    ...mergedData,
    ms_id: "merged",
  })
  window.appstate.chapters.forEach((_, index) => {
    const option = document.createElement("option")
    option.value = index + ""
    const annoCount = countAnnosPerChapter(
      dataWithChapterNumbers,
      index + 1 + "",
    )

    option.textContent = `Chapter ${index + 1} (${annoCount})`
    chapterSelect.appendChild(option)
  })
}

/**
 * Renders the navigation bar based on the given chapter index and annotations.
 *
 * @param {number} chapterIndex - The index of the chapter to display initially. Defaults to 0 if not provided.
 * @param {AnnotationFile} annotations - The annotation file containing metadata or additional details to populate the navigation.
 * @return {void} This function does not return a value.
 */
export function renderNavBar(
  chapterIndex: number,
  annotations: AnnotationFile,
): void {
  const chapters_node = document.querySelectorAll<HTMLElement>(
    'tei-div[type="chapter"]',
  )
  window.appstate.chapters = Array.from(chapters_node)
  window.appstate.currentChapterIndex = chapterIndex ? chapterIndex : 0
  populateChapterDropdown(annotations)
  displayChapter()
}
