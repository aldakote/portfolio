'use strict';

/* ---------------- */
/* Type Definitions */
/* ---------------- */
const PageSectionEnum = {
    HOME: 'home',
    PORTFOLIO: 'portfolio',
    ABOUT_ME: 'about',
    PORTFOLIO_PHOTOGRAPHY: 'portfolio_photography',
    PORTFOLIO_IMAGES: 'portfolio_images',
    isPortfolioSection(pageSection) {
        return (pageSection === this.PORTFOLIO) || (pageSection === this.PORTFOLIO_PHOTOGRAPHY);
    }
}

const CategoryEnum = {
    GRAPHIC_DESIGN: 'graphic_design',
    COMMERCIAL: 'commercial',
    PORTRAITS: 'portraits',
    PROJECTS: 'projects'
}

class ImageInfoDto {
    id;             // string
    category;       // CategoryEnum
    title;          // string
    description;    // string
    extension;      // string
    imgSrc;         // string
    position;       // int

    constructor(id, category, title, description, extension, imgSrc, position) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.description = description;
        this.extension = extension;
        this.imgSrc = imgSrc;
        this.position = position;
    }
}

class DB {
    async getImagesForCategory(category) {
        const response = await fetch(`./db/${category}_data.json`);
        if (!response.ok) {
            throw new Error('Error trying to connect with database');
        }
        const json = await response.json();
        return json.map(res => {
            let imgSrc = `images/photography/${category}/${res.id}.${res.extension}`;
            if (category === CategoryEnum.GRAPHIC_DESIGN) {
                imgSrc = `./images/${category}/${res.id}.${res.extension}`;
            }
            return new ImageInfoDto(res.id, category, res.title, res.description, res.extension, imgSrc, res.position);
        }).sort((a, b) => a.position - b.position);
    }
}

/* ---- */
/* Main */
/* ---- */
const categoryImageSrcMap = new Map();
categoryImageSrcMap.set(CategoryEnum.GRAPHIC_DESIGN, 'images/graphic_design/[cover]_graphic_design.jpg');
categoryImageSrcMap.set(CategoryEnum.COMMERCIAL, 'images/photography/commercial/[cover]_commercial.jpg');
categoryImageSrcMap.set(CategoryEnum.PORTRAITS, 'images/photography/portraits/[cover]_portrait.jpg');
categoryImageSrcMap.set(CategoryEnum.PROJECTS, 'images/photography/projects/[cover]_photography_and_projects.jpg');

const home_btn = document.getElementById('home-btn');
const portfolio_btn = document.getElementById('portfolio-btn');
const about_btn = document.getElementById('about-btn');
const logo_span = document.getElementById('logo-span');
const portfolio_images_category_h1 = document.getElementById('portfolio-images-category-h1');
const portfolio_images_blurred_background_img = document.getElementById('portfolio-images-blurred-background-img')

const home_elements = Array.from(document.getElementsByClassName('home'));
const portfolio_elements = Array.from(document.getElementsByClassName('portfolio'));
const about_elements = Array.from(document.getElementsByClassName('about'));
const portfolio_photography_elements = Array.from(document.getElementsByClassName('portfolio-photography'));
const portfolio_images_elements = Array.from(document.getElementsByClassName('portfolio-images'));

const photography_item = document.getElementById('photography-item');
const graphic_design_item = document.getElementById('graphic-design-item');
const projects_item = document.getElementById('projects-item');
const commercial_item = document.getElementById('commercial-item');
const portraits_item = document.getElementById('portraits-item');
const portfolio_images_list = document.getElementById('portfolio-images-list');

/* Event Listeners */
home_btn.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.HOME);
}, false);
portfolio_btn.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.PORTFOLIO);
}, false);
about_btn.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.ABOUT_ME);
}, false);
logo_span.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.HOME);
}, false);
photography_item.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.PORTFOLIO_PHOTOGRAPHY);
}, false);
graphic_design_item.addEventListener('click', async () => {
    await show_portfolio_images_section_for_category(CategoryEnum.GRAPHIC_DESIGN);
}, false);
projects_item.addEventListener('click', async () => {
    await show_portfolio_images_section_for_category(CategoryEnum.PROJECTS);
}, false);
commercial_item.addEventListener('click', async () => {
    await show_portfolio_images_section_for_category(CategoryEnum.COMMERCIAL);
}, false);
portraits_item.addEventListener('click', async () => {
    await show_portfolio_images_section_for_category(CategoryEnum.PORTRAITS);
}, false);

const list_items = document.getElementsByClassName('list-item');
const portfolio_list_items = document.getElementsByClassName('portfolio-list-item');

/* Show home page */
show_selected_elements_for(PageSectionEnum.HOME);

/* -------------------- */
/* Function Definitions */
/* -------------------- */
function show_selected_elements_for(pageSection) {
    home_elements.forEach((element) => {
        element.style.display = (pageSection === PageSectionEnum.HOME) ? 'flex' : 'none';
    });
    portfolio_elements.forEach((element) => {
        element.style.display = (pageSection === PageSectionEnum.PORTFOLIO) ? 'flex' : 'none';
    });
    about_elements.forEach((element) => {
        element.style.display = (pageSection === PageSectionEnum.ABOUT_ME) ? 'flex' : 'none';
    });
    portfolio_photography_elements.forEach((element) => {
        element.style.display = (pageSection === PageSectionEnum.PORTFOLIO_PHOTOGRAPHY) ? 'flex' : 'none';
    });
    portfolio_images_elements.forEach((element) => {
        element.style.display = (pageSection === PageSectionEnum.PORTFOLIO_IMAGES) ? 'flex' : 'none';
    });
    change_header_styles(pageSection);
}

async function show_portfolio_images_section_for_category(category) {
    clear_children(portfolio_images_list);
    portfolio_images_category_h1.innerText = category.toUpperCase().replace('_', ' ');
    portfolio_images_blurred_background_img.src = categoryImageSrcMap.get(category);
    show_selected_elements_for(PageSectionEnum.PORTFOLIO_IMAGES);

    const db = new DB();
    const images = await db.getImagesForCategory(category);
    images.forEach((imageInfoDto) => {
        portfolio_images_list.appendChild(create_list_item(imageInfoDto));
    });
}

function clear_children(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function create_list_item(imageInfoDto) {
    let listItemNode = document.createElement('li');
    listItemNode.className = 'list-item-result';

    let imgNode = document.createElement('img');
    imgNode.src = imageInfoDto.imgSrc;
    imgNode.alt = imageInfoDto.title;

    imgNode.addEventListener('click', () => {
        openImageOverlay(imageInfoDto);
    });

    listItemNode.appendChild(imgNode);
    return listItemNode;
}

function change_header_styles(pageSection) {
    const sheet = document.styleSheets[0];
    for (const rule of sheet.cssRules) {
        // List font color
        if (rule.selectorText === '.header-menu > nav > ul > li > span') {
            switch (pageSection) {
                case PageSectionEnum.HOME:
                case PageSectionEnum.ABOUT_ME:
                    rule.style.color = 'var(--font-color)';
                    break;
                case PageSectionEnum.PORTFOLIO:
                case PageSectionEnum.PORTFOLIO_PHOTOGRAPHY:
                case PageSectionEnum.PORTFOLIO_IMAGES:
                    rule.style.color = 'var(--background-color)';
                    break;
                default:
                    break;
            }
        }

        // List hover color
        if (rule.selectorText === '.header-menu > nav > ul > li > span:hover') {
            switch (pageSection) {
                case PageSectionEnum.HOME:
                case PageSectionEnum.ABOUT_ME:
                    rule.style.color = 'var(--light-green)';
                    break;
                case PageSectionEnum.PORTFOLIO:
                case PageSectionEnum.PORTFOLIO_PHOTOGRAPHY:
                case PageSectionEnum.PORTFOLIO_IMAGES:
                    rule.style.color = 'var(--dark-cyan)';
                    break;
                default:
                    break;
            }
        }

        // Logo font color
        if (rule.selectorText === '#logo') {
            switch (pageSection) {
                case PageSectionEnum.HOME:
                case PageSectionEnum.ABOUT_ME:
                    rule.style.color = 'var(--font-color)';
                    break;
                case PageSectionEnum.PORTFOLIO:
                case PageSectionEnum.PORTFOLIO_PHOTOGRAPHY:
                case PageSectionEnum.PORTFOLIO_IMAGES:
                    rule.style.color = 'var(--background-color)';
                    break;
                default:
                    break;
            }
        }

        // Logo hover animation color
        if (rule.selectorText === '#logo-span::after') {
            switch (pageSection) {
                case PageSectionEnum.HOME:
                case PageSectionEnum.ABOUT_ME:
                    rule.style.borderBottom = 'solid 3px var(--light-green)';
                    break;
                case PageSectionEnum.PORTFOLIO:
                case PageSectionEnum.PORTFOLIO_PHOTOGRAPHY:
                case PageSectionEnum.PORTFOLIO_IMAGES:
                    rule.style.borderBottom = 'solid 3px var(--dark-cyan)';
                    break;
                default:
                    break;
            }
        }
    }
}

const overlay = document.createElement('div');
overlay.id = 'image-overlay';
overlay.innerHTML = `
    <span id="image-overlay-close">&times;</span>
    <div id="overlay-content">
        <img src="" alt="overlay-image"/>
        <div id="overlay-text">
            <h2 id="overlay-title"></h2>
            <p id="overlay-description"></p>
        </div>
    </div>
`;
document.body.appendChild(overlay);

const overlayImg = overlay.querySelector('img');
const overlayTitle = document.getElementById('overlay-title');
const overlayDescription = document.getElementById('overlay-description');
const overlayClose = document.getElementById('image-overlay-close');

function openImageOverlay(imageInfo) {
    overlayImg.src = imageInfo.imgSrc;
    overlayTitle.textContent = imageInfo.title;
    overlayDescription.textContent = imageInfo.description;
    overlay.style.display = 'flex';
}

overlayClose.addEventListener('click', () => {
    overlay.style.display = 'none';
    overlayImg.src = '';
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.style.display = 'none';
        overlayImg.src = '';
    }
});