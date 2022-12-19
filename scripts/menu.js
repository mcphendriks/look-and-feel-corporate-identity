// MENU
const toggleMenu = () => {
    const navBar = document.querySelector('.nav-bar');
    const menuIcon = document.querySelector('.menu-icon');

    if (navBar.className === 'nav-bar') {
        navBar.className += ' responsive'
        menuIcon.style.transform = 'rotate(-90deg)'
    } else {
        navBar.className = 'nav-bar';
        menuIcon.style.transform = 'rotate(0)'
    }
}

