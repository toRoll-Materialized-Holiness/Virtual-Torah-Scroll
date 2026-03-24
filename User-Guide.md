# User guide

## Data structure and required information
- data/scroll.json 
    - contains metadata about the scrolls
- data/sefertagin.json 
    - optional, if scribal literature like Sefer Tagin should be included
    - contains metadata about the scribal literature, similar to scrolls.json
- data/material.json 
    - optional, if material annotations are present
- data/terms.json 
    - vocabulary terms
    - very important since the annotations won't be highlighted if the terms.json is not correct
- data/public
    - xml/html for each of the 5 books 
        - 1_Genesis, 2_Exodus, 3_Leviticus, 4_Numbers, 5_Deuteronomy
        - There is a conversion tool in tools/. But since the standard text does not change in general, usually you can reuse the xml and html files provided in this repository. 
    - json for each of the 5 books
        - 1_Genesis, 2_Exodus, 3_Leviticus, 4_Numbers, 5_Deuteronomy
        - contains all annotation data 
        - structured as an object for each scroll, containing an "annos" object stating "anno_id", "vocab_term", "xml_selector" and "text_id" (respective book id) for each annotation 
    - preview_images.jpg
        - thumb for each scroll 
        - will be displayed in dashboard
- data/crops 
    - contains the cropped images of the annotations
        
## Usage
- Direct to url:3000/dashboard.html
- The dashboard is the landing page of the Virtual Torah Scroll and displays all scrolls and their metadata
<img width="3978" height="1970" alt="dashboard" src="https://github.com/user-attachments/assets/be87ba7c-b8ed-4b4e-a618-e529ee634f51" />
- click "continue" to proceed to the analysis part
<img width="4175" height="1961" alt="vt_1" src="https://github.com/user-attachments/assets/729090c5-211d-47ef-8ae5-b07d226e5b40" />
- If you click on on one of the highlighted annotations, the respective tagin and otiyyot meshunnot for the selected scrolls will appear on the right side. Furthermore you can compare the occuring decorations of the not selected scrolls as well as the rules of the scribal literature. 
<img width="3437" height="1947" alt="vt_2" src="https://github.com/user-attachments/assets/b69d0c19-c253-423c-9597-4e94e5068aad" />
- You can filter the annotations by letter or decoration variation.
<img width="3286" height="1952" alt="vt_3" src="https://github.com/user-attachments/assets/eb6a673f-f67e-4a02-bd62-6f5bb48ebee8" />
- At the bottom of the analysis page, you can find the histograms of the annotation distribution as well as information on the letter distribution for each scroll.
<img width="817" height="610" alt="vt_4" src="https://github.com/user-attachments/assets/f97feb41-fb84-41de-bb0d-5c73f38c6614" />


