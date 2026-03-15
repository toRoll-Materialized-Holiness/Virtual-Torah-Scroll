import {
  Chart,
  ChartConfiguration,
  ChartDataset,
  ChartTypeRegistry,
  registerables,
} from "chart.js"
import { Annotation, AnnotationFile } from "./types/Annotations"
import { Scroll } from "./types/Scrolls"
import { displayChapter } from "./navigation"
import {
  manipulateData,
  mergeAnnoData,
  countAnnosPerChapter,
  mapMsIdtoMsName,
} from "./utils/annotations"
import { getAvailableChapterNumbers } from "./utils/dom"

Chart.register(...registerables)

/**
 * creates a diagram with given data on given element. The resulting diagram will display
 * the number of annotations per chapter summarized for the whole corpus
 *
 * @param {AnnotationFile} data contains annotations per manuscript
 * @param {HTMLSpanElement} $text the element containing the text of the scroll
 * @param {HTMLElement} $diagramContainer the container for the diagram
 */
export function createSummaryBarDiagram(
  data: AnnotationFile,
  $text: HTMLSpanElement,
  $diagramContainer: HTMLElement,
) {
  const newData = data.map((manuscriptData) => manipulateData(manuscriptData))
  const chartSeries = createSummaryBarChartData(newData, $text)

  const options: ChartConfiguration<
    keyof ChartTypeRegistry,
    { x: string; y: number }[]
  > = {
    type: "bar",
    data: {
      datasets: chartSeries,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Decorations",
          },
        },
        x: {
          title: {
            display: true,
            text: "Chapter",
          },
        },
      },
      onClick: (_, elements) => {
        if (elements.length > 0) {
          selectDataPoint(elements[0].index)
        }
      },
    },
  }

  // emptying the container (necessary for creation of subsequent diagrams)
  while ($diagramContainer.firstChild) {
    $diagramContainer.removeChild($diagramContainer.firstChild)
  }

  $diagramContainer.appendChild(document.createElement("canvas"))
  new Chart($diagramContainer.querySelector("canvas")!, options)
}

/**
 * creates a diagram with given data on given element. The resulting diagram will display
 * the number of annotations per chapter for each given manuscript separately
 *
 * @param {AnnotationFile} data contains annotations per manuscript
 * @param {Scroll[]} scrolls holds information about the scrolls
 * @param {HTMLElement} $text the element containing the text of the scroll
 * @param {HTMLElement} $diagramContainer the container for the diagram
 */
export function createBarDiagram(
  data: AnnotationFile,
  scrolls: Scroll[],
  $text: HTMLElement,
  $diagramContainer: HTMLElement,
) {
  const newData = data.map((manuscriptData) => manipulateData(manuscriptData))
  const chartSeries = createBarChartData(newData, scrolls, $text)
  const options: ChartConfiguration<
    keyof ChartTypeRegistry,
    { x: string; y: number }[]
  > = {
    type: "line",
    data: {
      datasets: chartSeries,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Decorations",
          },
        },
        x: {
          title: {
            display: true,
            text: "Chapter",
          },
        },
      },
      onClick: (_, elements) => {
        if (elements.length > 0) {
          selectDataPoint(elements[0].index)
        }
      },
    },
  }

  // emptying the container (necessary for creation of subsequent diagrams)
  while ($diagramContainer.firstChild) {
    $diagramContainer.removeChild($diagramContainer.firstChild)
  }

  $diagramContainer.appendChild(document.createElement("canvas"))
  new Chart($diagramContainer.querySelector("canvas")!, options)
}

/**
 * callback to be executed when a user clicks on a data point in a diagram. This will open
 * the chapter corresponding to the clicked data point
 *
 * @param idx Index of the clicked data point.
 */
function selectDataPoint(idx: number) {
  // you can't use the chapter number here as the navigation/displayChapter() uses indexes
  window.appstate.currentChapterIndex = idx
  displayChapter()
}

/**
 * converts the data into a format that can be used to create bar diagrams with ApexCharts.
 * Counts the number of annotations per chapter for the whole corpus
 *
 * @param data containing information about the annotations and the chapters, they can be found, in
 * for multiple manuscripts
 * @param $text containing chapters, needed to find all existing chapters of a text
 * @returns data that can be used to create bar diagrams with ApexCharts in format:
 * ```json
 * [
 *     {
 *         x: 1,
 *         y: 23
 *     },
 *     {
 *         x: 2,
 *         y: 43
 *     }
 * ]
 * ```
 * where x is the chapter number and y is the number of annotations in the given chapter
 */
function createSummaryBarChartData(
  data: Omit<AnnotationFile, "ms_id">,
  $text: HTMLElement,
) {
  const availableChapterNumbers = getAvailableChapterNumbers($text)
  const series = []
  const chartData: { x: string; y: number }[] = []

  const mergedData = mergeAnnoData(data)
  availableChapterNumbers.forEach((chapternumber) => {
    chartData.push({
      x: chapternumber ?? "",
      y: countAnnosPerChapter(mergedData, chapternumber ?? ""),
    })
  })
  series.push({ label: "Decorations per Chapter", data: chartData })

  return series
}

/**
 * converts the data into a format that can be used to create bar diagrams with ApexCharts.
 * Counts the number of annotations per chapter for each manuscript
 *
 * @param data containing information about the annotations and the chapters, they can be found, in
 * for multiple manuscripts
 * @param scrolls holds information about the scrolls
 * @param $text containing chapters, needed to find all existing chapters of a text
 * @returns data that can be used to create bardiagrams with ApexCharts in format:
 * ```json
 *  [
 *      {
 *          x: 1,
 *          y: 23
 *      },
 *      {
 *          x: 2,
 *          y: 43
 *      },
 *      {
 *          x: 1,
 *          y: 9
 *      },
 *      {
 *          x: 2,
 *          y: 15
 *      }
 * ]
 * ```
 * where x is the chapter number and y is the number of annotations in the given chapter. It can hold
 * multiple entries for the same x key/value pair as multiple manuscripts can be given
 */
function createBarChartData(
  data: AnnotationFile,
  scrolls: Scroll[],
  $text: HTMLElement,
) {
  const availableChapterNumbers = getAvailableChapterNumbers($text)
  const series: ChartDataset<
    keyof ChartTypeRegistry,
    { x: string; y: number }[]
  >[] = []

  data.forEach((manuscriptData, i) => {
    const chartData: { x: string; y: number }[] = []
    availableChapterNumbers.forEach((chapternumber) => {
      chartData.push({
        x: chapternumber ?? "",
        y: countAnnosPerChapter(manuscriptData, chapternumber ?? ""),
      })
    })
    series.push({
      label: mapMsIdtoMsName(manuscriptData.ms_id, scrolls),
      data: chartData,
      // fill: "origin",
      stepped: true,
      pointRadius: 4,
      tension: 0,
      borderDash: i >= 7 ? [5, 5] : undefined,
      borderWidth: 2,
    })
  })
  return series
}

/**
 * count the number of annotations on every letter
 *
 * @param annotations of one scroll
 * @returns countObject holding the number of annotations for each letter in the
 * form {letter: amount, letter: amount ...}
 */
function countAnnosPerLetter(annotations: Annotation[]) {
  const countObject = {
    alef: 0,
    ayin: 0,
    beit: 0,
    dalet: 0,
    gimel: 0,
    he: 0,
    het: 0,
    kaf: 0,
    kafsofit: 0,
    lamed: 0,
    mem: 0,
    memsofit: 0,
    nun: 0,
    nunsofit: 0,
    pe: 0,
    pesofit: 0,
    qof: 0,
    resh: 0,
    samekh: 0,
    shin: 0,
    tav: 0,
    teth: 0,
    tsade: 0,
    tsadesofit: 0,
    vav: 0,
    yod: 0,
    zayin: 0,
  }

  if (annotations) {
    annotations.forEach((annotation) => {
      switch (annotation.vocab_term.split("_")[0]) {
        case "alef":
          countObject.alef++
          break
        case "ayin":
          countObject.ayin++
          break
        case "beit":
          countObject.beit++
          break
        case "dalet":
          countObject.dalet++
          break
        case "gimel":
          countObject.gimel++
          break
        case "he":
          countObject.he++
          break
        case "het":
          countObject.het++
          break
        case "kaf":
          countObject.kaf++
          break
        case "kafsofit":
          countObject.kafsofit++
          break
        case "lamed":
          countObject.lamed++
          break
        case "mem":
          countObject.mem++
          break
        case "memsofit":
          countObject.memsofit++
          break
        case "nun":
          countObject.nun++
          break
        case "nunsofit":
          countObject.nunsofit++
          break
        case "pe":
          countObject.pe++
          break
        case "pesofit":
          countObject.pesofit++
          break
        case "qof":
          countObject.qof++
          break
        case "resh":
          countObject.resh++
          break
        case "samekh":
          countObject.samekh++
          break
        case "shin":
          countObject.shin++
          break
        case "tav":
          countObject.tav++
          break
        case "teth":
          countObject.teth++
          break
        case "tsade":
          countObject.tsade++
          break
        case "tsadesofit":
          countObject.tsadesofit++
          break
        case "vav":
          countObject.vav++
          break
        case "yod":
          countObject.yod++
          break
        case "zayin":
          countObject.zayin++
          break
      }
    })
  }

  return countObject
}

/**
 * creates a diagram displaying the number of annotations per letter
 *
 * @param data annotations of one scroll
 * @param $diagramContainer the container for the diagram
 */
export function createDecoratedLetterDiagram(
  data: Annotation[],
  $diagramContainer: HTMLElement,
) {
  const newData = countAnnosPerLetter(data)
  const options: ChartConfiguration = {
    type: "bar",
    data: {
      labels: Object.keys(newData),
      datasets: [
        {
          data: Object.values(newData),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Annotations",
          },
        },
        x: {
          title: {
            display: true,
            text: "Letter",
          },
        },
      },
    },
  }
  $diagramContainer.appendChild(document.createElement("canvas"))
  new Chart($diagramContainer.querySelector("canvas")!, options)
}
