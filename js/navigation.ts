import { AnnotationFile } from "./types/Annotations"
import { countAnnosPerChapter, manipulateData, mergeAnnoData } from "./utils/annotations"
import { getSelectedScrolls } from "./localStorage"

// Get ms ids from url and store in array
const selectedscrolls = getSelectedScrolls();
export function displayChapter() {
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

export function initializeNavBar() {
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

export function populateChapterDropdown(annotations: AnnotationFile) {
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

export function renderNavBar(
  chapterIndex: number,
  annotations: AnnotationFile,
) {
  const chapters_node = document.querySelectorAll<HTMLElement>(
    'tei-div[type="chapter"]',
  )
  window.appstate.chapters = Array.from(chapters_node)
  window.appstate.currentChapterIndex = chapterIndex ? chapterIndex : 0
  populateChapterDropdown(annotations)
  displayChapter()
}
