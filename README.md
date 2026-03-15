# Virtual Scroll

### Prerequisites

 - npm (included with Node.js)

### Development

    npm install
    npm run dev

Then access [http://localhost:5173/dashboard.html]()

### Building

    npm install
    npm run build

Generated files can be found in `dist` folder. Serve using any web server, for example try:

    npx http-server dist -p 3000 -d false --no-dotfiles

### Linting

    npm run lint

To automatically fix issues:

    npm run lint:fix

### Generating new HTML book files from XML files

Run the conversion tool, make sure to `npm install` before:

    node ./tools/XMLtoHTML.mjs

It will automatically create the new HTML files

### Deployment

#### Image Data

The UI can provide the cropped annotation regions in the annotation card in two ways: 
by client-side cropping (may impact browser performance) or by shipping the cropped images serverside

In case you want to rely on client side cropping of the original images at remote URL, set `USE_LOCAL_IMAGES` in annotationCard.ts to `false`
In case you want to use local cropped images, you have to provide them in the folder `./data/public/crops` (in development or **before** building).

The cropped images given in `./data/public/crops` of this release are kindly provided by the following institutions and the project "toRoll - Materialized Holiness" funded by the Federal Ministry of Research, Technology and Space (01UL2202B).
| Signature | Attribution |
| -------- | -------- | 
| 2° Ms. theol. 1 | Universitätsbibliothek Kassel, Landesbibliothek und Murhardsche Bibliothek der Stadt Kassel.| 
| Cod. Guelf. 148 Noviss. 2° | <http://diglib.hab.de/mss/148-noviss-2f/start.htm>  Herzog August Bibliothek Wolfenbüttel. | 
| Cod. Guelf. 149 Noviss. 2° | <http://diglib.hab.de/mss/149-noviss-2f/start.htm> HAB Wolfenbüttel. | 
| Cod. Parm. 3295 | Biblioteca Palatina, Parma. |
| Cod. Parm. 3598 | Biblioteca Palatina, Parma. | 
| Cod. Parm. 3599 | Biblioteca Palatina, Parma. |
| Cod. Parm. 3601 | Biblioteca Palatina, Parma. |
| Ms. or. fol. 1215 | Staatsbibliothek zu Berlin, Preußischer Kulturbesitz, Orientabteilung. |
| Ms. or. fol. 1216 | Staatsbibliothek zu Berlin, Preußischer Kulturbesitz, Orientabteilung. |
| Ms. or. fol. 1217 | Staatsbibliothek zu Berlin, Preußischer Kulturbesitz, Orientabteilung. |
| Ms. or. fol. 1218 | Staatsbibliothek zu Berlin, Preußischer Kulturbesitz, Orientabteilung. |
| Ms. or. fol. 133 | Staatsbibliothek zu Berlin, Preußischer Kulturbesitz, Orientabteilung. |
| Ms. or. fol. 134 | Staatsbibliothek zu Berlin, Preußischer Kulturbesitz, Orientabteilung. |
| Ms. or. fol. 4317 | Staatsbibliothek zu Berlin, Preußischer Kulturbesitz, Orientabteilung. |

