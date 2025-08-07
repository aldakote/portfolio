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

    constructor(id, category, title, description, extension, imgSrc) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.description = description;
        this.extension = extension;
        this.imgSrc = imgSrc;
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
            let imgSrc = `./images/photography/${category}/${res.id}.${res.extension}`;
            if (category === CategoryEnum.GRAPHIC_DESIGN) {
                imgSrc = `./images/${category}/${res.id}.${res.extension}`;
            }
            return new ImageInfoDto(res.id, category, res.title, res.description, res.extension, imgSrc);
        });
    }
}

/* ---- */
/* Main */
/* ---- */
const home_btn = document.getElementById('home-btn');
const portfolio_btn = document.getElementById('portfolio-btn');
const about_btn = document.getElementById('about-btn');
const logo_span = document.getElementById('logo-span');

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

// Portfolio elements (colors and animation change when user is on this page, that's why we have different elements)
const home_portfolio_btn = document.getElementById('home-portfolio-btn');
const portfolio_portfolio_btn = document.getElementById('portfolio-portfolio-btn');
const about_portfolio_btn = document.getElementById('about-portfolio-btn');
const logo_span_portfolio = document.getElementById('logo-span-portfolio');
const list_items = document.getElementsByClassName('list-item');
const portfolio_list_items = document.getElementsByClassName('portfolio-list-item');

// Portfolio elements event listeners
home_portfolio_btn.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.HOME);
}, false);
portfolio_portfolio_btn.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.PORTFOLIO);
}, false);
about_portfolio_btn.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.ABOUT_ME);
}, false);
logo_span_portfolio.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.HOME);
}, false);

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
    handle_visibility_for_portfolio_elements(pageSection);
}

function handle_visibility_for_portfolio_elements(pageSection) {
    for (let i = 0; i < portfolio_list_items.length; i++) {
        portfolio_list_items[i].style.display = PageSectionEnum.isPortfolioSection(pageSection) ? 'flex' : 'none';
        list_items[i].style.display = PageSectionEnum.isPortfolioSection(pageSection) ? 'none' : 'flex';
        list_items[i].style.animation = 'none';
    }
    logo_span.style.display = PageSectionEnum.isPortfolioSection(pageSection) ? 'none' : 'block';
    logo_span_portfolio.style.display = PageSectionEnum.isPortfolioSection(pageSection) ? 'block' : 'none';
}

async function show_portfolio_images_section_for_category(category) {
    clear_children(portfolio_images_list);
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

    let titleNode = document.createElement('span');
    titleNode.className = 'list-item-result-title';
    titleNode.innerText = imageInfoDto.title;

    let descriptionNode = document.createElement('span');
    descriptionNode.className = 'list-item-result-description';
    descriptionNode.innerText = imageInfoDto.description;

    listItemNode.appendChild(imgNode);
    listItemNode.appendChild(titleNode);
    listItemNode.appendChild(descriptionNode);
    return listItemNode;
}