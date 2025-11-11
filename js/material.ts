import { Chart, registerables } from "chart.js"
import type { MaterialAnnotation } from "./types/Annotations"
import type { Scroll } from "./types/Scrolls"

Chart.register(...registerables)

export function renderMaterialTab(
  materialanno: MaterialAnnotation,
  scroll: Scroll,
) {
  const materialtable = document
    .getElementById("materialtable")!
    .getElementsByTagName("tbody")[0]
  materialtable.innerHTML = ""

  const newRow = materialtable.insertRow()
  newRow.innerHTML =
    "<tr><td>Type</td><td class='text-secondary'>" +
    materialanno.ink_type +
    "</td></tr>"
  const newRow2 = materialtable.insertRow()
  newRow2.innerHTML =
    "<tr><td>Ink Batch</td><td class='text-secondary'>" +
    materialanno.ink_batch +
    " </td></tr>"
  const newRow3 = materialtable.insertRow()
  newRow3.innerHTML =
    "<tr><td>Scroll</td><td class='text-secondary'>" +
    scroll.title +
    " </td></tr>"

  console.log(materialanno.measurement.data)

  const data = {
    datasets: [
      {
        label: "",
        data: materialanno.measurement.data.map((d) => d.y),
        backgroundColor: [
          "#F44336",
          "#E91E63",
          "#2b908F",
          "#33b2df",
          "#FEB019",
        ],
        barThickness: 20,
      },
    ],
    labels: materialanno.measurement.data.map((d) => d.x),
  }

  const options = {
    indexAxis: "y", // makes it horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  } as const

  const config = {
    type: "bar",
    data,
    options,
  } as const

  const materialchart = document.getElementById("chart-material-bar")!
  materialchart.innerHTML = ""

  materialchart.appendChild(document.createElement("canvas"))
  new Chart(materialchart.querySelector("canvas")!, config)

  const images_div = document.getElementById("measurementimage")!
  images_div.innerHTML = ""

  for (const image in materialanno.images) {
    const image_source = "../" + materialanno.images[image] + "_Picture_1.bmp"
    const measurement_image = document.createElement("img")
    measurement_image.src = image_source
    measurement_image.classList.add("img-thumbnail")
    images_div.append(measurement_image)
  }
}
