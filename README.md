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
In case you want to use local cropped images, you have to provide them in the folder `./data/public/crops` (in development or **before** building). Obtain a zip from [this repo](https://gitlab.kit.edu/kit/scc/dem/toroll/data-wrangling/virtual-scroll-crops) and then link or move crops folder to that location.
