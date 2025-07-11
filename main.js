'use strict';

/* ---------------- */
/* Type Definitions */
/* ---------------- */
const PageSectionEnum = {
    HOME: 'home',
    PORTFOLIO: 'portfolio',
    ABOUT_ME: 'about'
}

const CategoryEnum = {
    PHOTOGRAPHY: 'photography',
    GRAPHIC_DESIGN: 'graphic_design'
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
        return json.map(res => new ImageInfoDto(res.id, category, res.title, res.description, res.extension, `./images/${res.id}.${res.extension}`));
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

show_selected_elements_for(PageSectionEnum.HOME);

const db = new DB();
load_all_images(db);

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

/* -------------------- */
/* Function Definitions */
/* -------------------- */
function show_selected_elements_for(name) {
    home_elements.forEach((element) => {
        element.style.display = (name === PageSectionEnum.HOME) ? 'flex' : 'none';
    });
    portfolio_elements.forEach((element) => {
        element.style.display = (name === PageSectionEnum.PORTFOLIO) ? 'flex' : 'none';
    });
    about_elements.forEach((element) => {
        element.style.display = (name === PageSectionEnum.ABOUT_ME) ? 'flex' : 'none';
    });
}

async function load_all_images(db) {
    const photographyImageList = await db.getImagesForCategory(CategoryEnum.PHOTOGRAPHY);
    const graphicDesignImageList = await db.getImagesForCategory(CategoryEnum.GRAPHIC_DESIGN);
    console.log(photographyImageList);
    console.log(graphicDesignImageList);
}