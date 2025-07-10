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
    PHOTOGRAPHY: 0,
    GRAPHIC_DESIGN: 1
}

class ImageInfoDto {
    id;             // string
    category;       // CategoryEnum
    title;          // string
    description;    // string
    imgSrc;         // string

    constructor(id, category, title, description, imgSrc) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.description = description;
        this.imgSrc = imgSrc;
    }
}

/* ---- */
/* Main */
/* ---- */
const home_btn = document.getElementById('home-btn');
const portfolio_btn = document.getElementById('portfolio-btn');
const about_btn = document.getElementById('about-btn');

const home_elements = Array.from(document.getElementsByClassName('home'));
const portfolio_elements = Array.from(document.getElementsByClassName('portfolio'));
const about_elements = Array.from(document.getElementsByClassName('about'));

home_btn.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.HOME)
}, false);
portfolio_btn.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.PORTFOLIO)
}, false);
about_btn.addEventListener('click', () => {
    show_selected_elements_for(PageSectionEnum.ABOUT_ME)
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
