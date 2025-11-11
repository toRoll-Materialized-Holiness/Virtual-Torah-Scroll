import data from "../data/scrolls.json"
import "./search"
import { getSelectedScrolls } from "./localStorage"

const scrolls = data

function populateDashboard() {
  for (const roll in data) {
    createRollDiv(data[roll].title, data[roll].id, data[roll].thumb_dashboard)
    scrolls.push(data[roll])
  }
}

function onRollSelected() {
  const selectedScrolls = document.querySelectorAll(
    ".form-imagecheck-input:checked",
  ) as NodeListOf<HTMLInputElement>

  const count = document.querySelector("span#selected_rolls_count")
  if (count instanceof HTMLSpanElement) {
    count.innerText = selectedScrolls.length + ""
  }

  const deselectBtn = document.querySelector("#deselect_btn")
  const continueBtn = document.querySelector("#continue_btn")
  if (selectedScrolls.length > 0) {
    deselectBtn?.classList.remove("disabled")
    continueBtn?.classList.remove("disabled")
  } else {
    deselectBtn?.classList.add("disabled")
    continueBtn?.classList.add("disabled")
  }
}

function createRollDiv(id: string, repo_id: string, image_thumb: string) {
  const rollDiv = document.createElement("div")
  rollDiv.classList.add("col-3")
  rollDiv.classList.add("scroll")
  rollDiv.id = repo_id

  const rollLabel = document.createElement("label")
  rollLabel.classList.add("form-imagecheck")

  const rollInput = document.createElement("input")
  rollInput.name = "image"
  rollInput.type = "checkbox"
  rollInput.value = repo_id
  rollInput.onchange = onRollSelected
  rollInput.classList.add("form-imagecheck-input")

  const rollSpan = document.createElement("span")
  rollSpan.classList.add("form-imagecheck-figure")

  const rollImage = document.createElement("img")
  rollImage.src = image_thumb
  rollImage.classList.add("form-imagecheck-image")

  const rollCard = document.createElement("div")
  rollCard.classList.add("card")

  const rollCardDiv = document.createElement("div")
  rollCardDiv.classList.add("card-body")
  rollCardDiv.classList.add("d-flex")

  const cardTitle = document.createElement("h3")
  cardTitle.classList.add("card-title")
  cardTitle.classList.add("m-auto")
  cardTitle.textContent = id

  rollCardDiv.append(cardTitle)
  rollCard.append(rollCardDiv)

  rollSpan.append(rollImage)
  rollSpan.append(rollCard)

  rollLabel.append(rollInput)
  rollLabel.append(rollSpan)

  rollDiv.append(rollLabel)
  document.getElementById("roll_row")?.append(rollDiv)
}

/**
 * set the checked property of the input to true for all given scrolls
 * 
 * @param {[String]} scrolls array holding the ids of scrolls
 */
function selectScrolls(scrolls: Array<string>) {
  scrolls.forEach((scroll: string) => {
    // the scroll ids have to be escaped as they are numbers and numbers have to be escaped,
    // if they are used in CSS selectors
    const $input = document.querySelector(`#${CSS.escape(scroll)} .form-imagecheck-input`) as HTMLInputElement;
    if ($input) {
      $input.checked = true;
    }
  });
  onRollSelected();
}

populateDashboard()
const preselectedScrolls = getSelectedScrolls();
selectScrolls(preselectedScrolls);
