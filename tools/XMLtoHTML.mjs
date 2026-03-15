import { JSDOM } from "jsdom"
import * as fs from "fs"
import * as path from "node:path"

async function run() {
  const CETEI = (await import("CETEIcean")).default

  const jdom = new JSDOM(`<TEI xmlns="http://www.tei-c.org/ns/1.0" />`, {
    contentType: "text/xml",
  })
  global.DOMParser = jdom.window.DOMParser
  const cet = new CETEI({
    documentObject: jdom.window.document,
  })

  fs.readdir(path.resolve("./data"), (err, files) => {
    if (err) return console.log(err)

    console.log("Transpiling the following files:")

    for (const file of files) {
      if (file.endsWith(".xml")) {
        console.log(file)
        fs.readFile(path.resolve("./data", file), "utf-8", (err, data) => {
          if (err) return console.error(err)

          const html = cet.makeHTML5(data)
          const serialized = new jdom.window.XMLSerializer().serializeToString(
            html,
          )
          // console.log(serialized)
          fs.writeFile(
            path.resolve("./data", file.replace(".xml", ".html")),
            serialized,
            (err) => {
              if (err) return console.error(err)
              console.log("Done with " + file)
            },
          )
        })
      }
    }
  })
}

run()
