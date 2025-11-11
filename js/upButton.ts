const btn = document.querySelector("#upButton")

if (!btn) throw "#upButton does not exist"

const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    btn.classList.add("visually-hidden")
  } else {
    btn.classList.remove("visually-hidden")
  }
})

observer.observe(document.querySelector("#heading")!)

btn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  })
})
