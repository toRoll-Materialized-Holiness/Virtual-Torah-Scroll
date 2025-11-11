import material from "../data/material.json"
import { Annotation } from "./types/Annotations"
import { renderMaterialTab } from "./material"
import sefertagindata from "../data/sefertagin.json"

// Provide voc_url to redirect to vocabulary term
const voc_url = ""

const USE_LOCAL_IMGS = true
// if USE_LOCAL_IMGS is set to false, please provide the url of the image resources here
const repo_url = ""

/**
 *
 * @param selected_spot
 * @param selected_scrolls
 */
window.openAnnoCard = function openAnnoCard(
  selected_spot: HTMLSpanElement,
  selected_scrolls: string,
) {
  console.log("selected spot", selected_spot)

  // force the first tab to be shown whenever the annotation card is openend
  const tagintab = document.getElementById("tagintab")!
  const tagincontent = document.getElementById("tabs-home-ex2")!
  const materialtab = document.getElementById("materialtab")!
  const materialcontent = document.getElementById("tabs-material-ex2")!
  const referencestab = document.getElementById("referencestab")!
  const referencescontent = document.getElementById("tabs-ref-ex2")!

  materialtab.classList.add("disabled")
  if (
    materialtab.classList.contains("active") ||
    referencestab.classList.contains("active")
  ) {
    materialtab.classList.remove("active")
    materialcontent.classList.remove("active")
    materialcontent.classList.remove("show")
    referencestab.classList.remove("active")
    referencescontent.classList.remove("active")
    referencescontent.classList.remove("show")
    tagintab.classList.add("active")
    tagincontent.classList.add("active")
    tagincontent.classList.add("show")
  }

  // Function to clear the thumb_wrapper and classification
  function clearThumbWrapper() {
    const thumb_wrapper = document.getElementById("thumb_wrapper")!
    thumb_wrapper.innerHTML = ""
    const classification = document.getElementById("classification")!
    classification.innerHTML = ""
    const witnesses = document.getElementById("witnesses")!
    witnesses.innerHTML = ""
    const sefertagin = document.getElementById("sefertagin")!
    sefertagin.innerHTML = ""
    document
      .getElementById("annotationcard_col")!
      .classList.add("visually-hidden")
    document
      .getElementById("witnesses-container")!
      .classList.add("visually-hidden")
    document
      .getElementById("sefertagin-container")!
      .classList.add("visually-hidden")
  }

  function renderAnnotationImage(
    matching_annos: Annotation[],
    hit: number,
    classification_term: HTMLAnchorElement,
  ) {
    const fixedHeight = 100

    const img_link = matching_annos[hit].image
    const local_img = matching_annos[hit].local_image
    const annotation_image = document.createElement("img")
    annotation_image.alt = classification_term.innerText

    if (!USE_LOCAL_IMGS && img_link !== undefined) {
      annotation_image.src = repo_url + img_link
    } else if (local_img !== undefined) {
      annotation_image.src = "/crops/" + local_img
    } else {
      //try to show a placeholder als fallback
      annotation_image.src =
        "/term_placeholder/" + classification_term.innerText + ".png"
      annotation_image.style = "opacity:0.3;"
    }
    if (annotation_image.src.includes("#xywh=")) {
      //IMPORTANT NOTE: the fixed height is not applied in case of client side cropping of a fragment identifier, since it interferes with the cropping. This is only a fall back solution
      const media_frag = annotation_image.src
        .split("#xywh=")[1]
        .split(",")
        .map(Number)
      console.log(media_frag)
      annotation_image.style.objectFit = "none"
      annotation_image.style.width = `${media_frag[2]}px`
      annotation_image.style.height = `${media_frag[3]}px`
      annotation_image.style.objectPosition = `-${media_frag[0]}px -${media_frag[1]}px`
    } else {
      annotation_image.style.height = `${fixedHeight}px`
    }
    annotation_image.classList.add("img-thumbnail")
    annotation_image.setAttribute(
      "onerror",
      "this.onerror=null; this.src='./term_placeholder/image-off.png'; this.style='opacity:0.3';",
    )
    return annotation_image
  }

  clearThumbWrapper()

  document
    .getElementById("annotationcard_col")!
    .classList.remove("visually-hidden")

  const matching_annos: Annotation[] = []
  window.appstate.anno_json.forEach((item) => {
    item.annos.forEach((anno) => {
      const xml_selector = anno.xml_selector.join(",")
      if (xml_selector === selected_spot.id) {
        matching_annos.push(anno)
      }
    })
  })
  console.log(matching_annos)
  const selected_scrolls_array = selected_scrolls.split(",")
  console.log(window.appstate.scrolls)

  try {
    const bookName = window.appstate.current_book.split("_")[1].split(".")[0]
    const chapter =
      parseInt(
        document.querySelector<HTMLSelectElement>("#chapterSelect")!.value,
      ) + 1
    const verse = selected_spot.parentElement?.parentElement?.getAttribute("n")
    document.getElementById("chapter")!.innerText =
      `${bookName} Chapter ${chapter} Verse ${verse || "unknown"}`
  } catch (e) {
    console.error("Failed to parse book, chapter or verse", e)
  }

  for (let hit = 0; hit < matching_annos.length; hit++) {
    for (const scroll in window.appstate.scrolls) {
      for (const materialanno in material) {
        // only show material tab if Kassel is one of the selected scrolls
        if (
          matching_annos[hit].anno_id === material[materialanno].anno_id &&
          window.appstate.scrolls[scroll].id ===
            "7b0f243c-cb0d-4d54-963b-310e18bb117a"
        ) {
          renderMaterialTab(
            material[materialanno],
            window.appstate.scrolls[scroll],
          )
          document.getElementById("materialtab")!.classList.remove("disabled")
        }
      }

      if (
        matching_annos[hit].text_id.includes(
          window.appstate.scrolls[scroll].id_genesis,
        ) ||
        matching_annos[hit].text_id.includes(
          window.appstate.scrolls[scroll].id_exodus,
        ) ||
        matching_annos[hit].text_id.includes(
          window.appstate.scrolls[scroll].id_leviticus,
        ) ||
        matching_annos[hit].text_id.includes(
          window.appstate.scrolls[scroll].id_numbers,
        ) ||
        matching_annos[hit].text_id.includes(
          window.appstate.scrolls[scroll].id_deuteronomy,
        )
      ) {
        console.log(window.appstate.scrolls[scroll])

        const annotation_div = document.createElement("div")
        annotation_div.classList.add(
          "tw:flex",
          "tw:items-center",
          "tw:flex-col",
        )

        const classification_div = document.createElement("h4")

        const classification_term = document.createElement("a")
        classification_term.innerText = matching_annos[hit].vocab_term
        classification_term.href = voc_url + matching_annos[hit].vocab_term
        classification_term.target = "_blank"

        classification_div.innerText = window.appstate.scrolls[scroll].title

        const annotation_image = renderAnnotationImage(
          matching_annos,
          hit,
          classification_term,
        )

        annotation_div.append(annotation_image)
        annotation_div.append(classification_term)
        annotation_div.append(classification_div)

        if (
          selected_scrolls_array.includes(window.appstate.scrolls[scroll].id)
        ) {
          document.getElementById("thumb_wrapper")!.append(annotation_div)
        } else {
          document.getElementById("witnesses")!.append(annotation_div)
          document
            .getElementById("witnesses-container")!
            .classList.remove("visually-hidden")
        }
      }
    }

    // Sefer Tagin
    for (const sefertagin_scroll in sefertagindata) {
      if (
        matching_annos[hit].text_id.includes(
          sefertagindata[sefertagin_scroll].id_genesis,
        ) ||
        matching_annos[hit].text_id.includes(
          sefertagindata[sefertagin_scroll].id_exodus,
        ) ||
        matching_annos[hit].text_id.includes(
          sefertagindata[sefertagin_scroll].id_leviticus,
        ) ||
        matching_annos[hit].text_id.includes(
          sefertagindata[sefertagin_scroll].id_numbers,
        ) ||
        matching_annos[hit].text_id.includes(
          sefertagindata[sefertagin_scroll].id_deuteronomy,
        )
      ) {
        //console.log(window.appstate.scrolls[scroll])

        const sefertagin_div = document.createElement("div")
        sefertagin_div.classList.add(
          "tw:flex",
          "tw:items-center",
          "tw:flex-col",
        )

        const classification_div = document.createElement("h4")

        const classification_term = document.createElement("a")
        classification_term.innerText = matching_annos[hit].vocab_term
        classification_term.href = voc_url + matching_annos[hit].vocab_term
        classification_term.target = "_blank"

        classification_div.innerText = sefertagindata[sefertagin_scroll].title

        const annotation_image = renderAnnotationImage(
          matching_annos,
          hit,
          classification_term,
        )

        sefertagin_div.append(annotation_image)
        sefertagin_div.append(classification_term)
        sefertagin_div.append(classification_div)

        document.getElementById("sefertagin")!.append(sefertagin_div)
        document
          .getElementById("sefertagin-container")!
          .classList.remove("visually-hidden")
      }
    }
  }

  // Add event listener to the annoation card's close button
  const annoclose = document.getElementById("btn_close_annocard")!
  annoclose.addEventListener("click", clearThumbWrapper)

  console.log(selected_spot)
  console.log(selected_scrolls)
  //console.log(word, start, length);
}
