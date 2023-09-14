const home_btn = document.getElementById('home-btn');
const portfolio_btn = document.getElementById('portfolio-btn');
const about_btn = document.getElementById('about-btn');

const home_elements = Array.from(document.getElementsByClassName('home'));
const portfolio_elements = Array.from(document.getElementsByClassName('portfolio'));
const about_elements = Array.from(document.getElementsByClassName('about'));

console.log(home_elements)

home_btn.addEventListener('click', () => {
    show_selected_elements_for('home')
}, false);
portfolio_btn.addEventListener('click', () => {
    show_selected_elements_for('portfolio')
}, false);
about_btn.addEventListener('click', () => {
    show_selected_elements_for('about')
}, false);


function show_selected_elements_for(name) {
    if (name === 'home') {
        home_elements.forEach((element) => {
            element.style.display = 'flex'
        });
        portfolio_elements.forEach((element) => {
            element.style.display = 'none';
        });
        about_elements.forEach((element) => {
            element.style.display = 'none';
        });
    } else if (name === 'portfolio') {
        home_elements.forEach((element) => {
            element.style.display = 'none'
        });
        portfolio_elements.forEach((element) => {
            element.style.display = 'flex';
        });
        about_elements.forEach((element) => {
            element.style.display = 'none';
        });
    } else {
        home_elements.forEach((element) => {
            element.style.display = 'none'
        });
        portfolio_elements.forEach((element) => {
            element.style.display = 'none';
        });
        about_elements.forEach((element) => {
            element.style.display = 'flex';
        });
    }
}