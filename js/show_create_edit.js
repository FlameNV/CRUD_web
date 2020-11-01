const openAddCarButton = document.getElementById('add_car_open_button');
const add_car_section = document.getElementById('add_car');
const close_cross = document.getElementById('cross');

openAddCarButton.addEventListener('click', () => {
    add_car_section.classList.add('show');
})

close_cross.addEventListener('click', () => {
    add_car_section.classList.remove('show');
})