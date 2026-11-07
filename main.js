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

const header_el = document.querySelector('header');
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
    route('#home', true);
}, false);
portfolio_btn.addEventListener('click', () => {
    route('#portfolio', true);
}, false);
about_btn.addEventListener('click', () => {
    route('#about', true);
}, false);
logo_span.addEventListener('click', () => {
    route('#home', true);
}, false);
photography_item.addEventListener('click', () => {
    route('#portfolio/photography', true);
}, false);
graphic_design_item.addEventListener('click', () => {
    route('#portfolio/graphic_design', true);
}, false);
projects_item.addEventListener('click', () => {
    route('#portfolio/photography/projects', true);
}, false);
commercial_item.addEventListener('click', () => {
    route('#portfolio/photography/commercial', true);
}, false);
portraits_item.addEventListener('click', () => {
    route('#portfolio/photography/portraits', true);
}, false);

const list_items = document.getElementsByClassName('list-item');
const portfolio_list_items = document.getElementsByClassName('portfolio-list-item');

/* Routing (enables browser back/forward navigation) */
async function route(hash, push) {
    hash = hash || '#home';
    const parts = hash.replace('#', '').split('/').filter(Boolean);

    if (parts[0] === 'about') {
        show_selected_elements_for(PageSectionEnum.ABOUT_ME);
    } else if (parts[0] === 'portfolio' && parts[1] === 'photography' && parts[2]) {
        await show_portfolio_images_section_for_category(parts[2]);
    } else if (parts[0] === 'portfolio' && parts[1] === 'photography') {
        show_selected_elements_for(PageSectionEnum.PORTFOLIO_PHOTOGRAPHY);
    } else if (parts[0] === 'portfolio' && parts[1]) {
        await show_portfolio_images_section_for_category(parts[1]);
    } else if (parts[0] === 'portfolio') {
        show_selected_elements_for(PageSectionEnum.PORTFOLIO);
    } else {
        show_selected_elements_for(PageSectionEnum.HOME);
    }

    if (push) {
        history.pushState(null, '', hash);
    }
}

window.addEventListener('popstate', () => {
    route(location.hash, false);
});

/* Show initial page based on current URL */
route(location.hash, false);

/* Mobile swipe-category dot indicators */
function setup_scroll_dots(containerSelector) {
    const container = document.querySelector(containerSelector);
    const dotsEl = container ? container.querySelector('.scroll-dots') : null;
    if (!container || !dotsEl) return;
    const dots = Array.from(dotsEl.children);
    container.addEventListener('scroll', () => {
        const index = Math.round(container.scrollLeft / container.clientWidth);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }, { passive: true });
}
setup_scroll_dots('.portfolio');
setup_scroll_dots('.portfolio-photography');

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
    const useLightHeader = pageSection === PageSectionEnum.PORTFOLIO
        || pageSection === PageSectionEnum.PORTFOLIO_PHOTOGRAPHY
        || pageSection === PageSectionEnum.PORTFOLIO_IMAGES;
    header_el.classList.toggle('light-header', useLightHeader);
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