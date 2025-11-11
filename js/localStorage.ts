/**
 * helper function to check, if the storage api is available
 * see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 * @param type
 * @returns
 */
export function storageAvailable(type: string) {
  let storage
  try {
    storage = window[type] as Storage
    const x = "__storage_test__"
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    )
  }
}

/**
 * extract ids of.selected scroll by a user from localStorage or URL
 *
 * @returns array holding the ids of all the preselected scrolls
 */
export function getSelectedScrolls() {
  let selectedscrolls: string[]
  if (storageAvailable("localStorage")) {
    const item = window.localStorage.getItem("selectedScrolls")
    selectedscrolls = item ? JSON.parse(item) : []
  } else {
    selectedscrolls = window.location.href.split("?ids=")[1].split(",")
  }
  return selectedscrolls
}
