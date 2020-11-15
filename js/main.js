const carList = document.getElementById('cars-list');
const searchBar = document.getElementById('find-car');
const clearButton = document.getElementById('clear-search-bar');

const createCarID = document.getElementById('create_id');
const createCarName = document.getElementById('create_name');
const createCarPower = document.getElementById('create_powerInHP');
const createCarPrice = document.getElementById('create_priceInUSD');

let editActive = false;

const cars_url = 'http://localhost:5000/car';

let cars = [];

function fetchData(url) {
    fetch(url).then(response => response.json()).then(data => {
        for (i = 0; i < data.length; i++) {
            cars.push(data[i]);
        }
        displayCars(cars);
    });
}

let currentCars = cars

// SEARCH
searchBar.addEventListener('keyup', filterCars)

function filterCars(searchString) {
    const searchFilterString = searchString.target.value.toLowerCase();
    const filteredCars = cars.filter(car => {
        return car.name.toLowerCase().includes(searchFilterString);
    });
    currentCars = filteredCars;
    showSortedCars();
}

clearButton.addEventListener('click', () => {
    searchBar.value = '';
    currentCars = cars;
    showSortedCars();
})

// CALCULATE
function calculatePrice() {
    var priceSum = 0;
    var totalPriceLabel = document.getElementById('total-price');
    currentCars.forEach(car => priceSum += car.priceInUSD);
    totalPriceLabel.textContent = 'Total price: ' + priceSum + '$';
}

//SORT
function showSortedCars() {
    var sortType = document.getElementById('sort-select').value;
    if (sortType == 'none') {
        displayCars(currentCars);
        return;
    } else if (sortType == 'name') {
        currentCars.sort(compareByName);
    } else if (sortType == 'power') {
        currentCars.sort(compareByPower);
    } else if (sortType == 'price') {
        currentCars.sort(compareByPrice);
    }
    displayCars(currentCars);
}

function compareByName(firstCar, secondCar) {
    var firstCarName = firstCar.name.toLowerCase();
    var secondCarName = secondCar.name.toLowerCase();
    if (firstCarName < secondCarName) {
        return -1;
    }
    if (firstCarName > secondCarName) {
        return 1;
    }
    return 0;
}

function compareByPower(firstCar, secondCar) {
    return firstCar.powerInHP - secondCar.powerInHP;
}

function compareByPrice(firstCar, secondCar) {
    return firstCar.priceInUSD - secondCar.priceInUSD;
}

//DISPLAY
const displayCars = (carsToShow) => {
    const htmlString = carsToShow.map((car) => {
        return `
        <li class="car">
        <div>            
        <h2 class="car_id">${car.id}</h2>
        <h2>${car.name}</h2>
        <h3 class="powerInHP">${car.powerInHP} HP</h3>
        <h3 class="priceInUSD">${car.priceInUSD} $</h3>
    </div>
    <form class="form__edit_car" id="form__edit_car">
            <input id="edit_name" name="name" type="text" placeholder="Name">
            <input id="edit_powerInHP" name="powerInHP" type="number" step=1 placeholder="Power">
            <input id="edit_priceInUSD" name="priceInUSD" type="number" placeholder="Price">
    </form>
            <div class= "control-buttons">
                <button class="btn btn-warning" id="edit-button" onclick="editRecord(this)">Edit</button>
                <button class="btn btn-danger" id="delete-button" onclick="deleteRecord(this)">Delete</button>
            </div>
        </li>
        `
    }).join('');

    carList.innerHTML = htmlString;
}

//DELETE
function deleteRecord(record) {
    const list_to_delete = record.parentNode.parentNode;
    let carId = parseInt(list_to_delete.childNodes[1].childNodes[1].innerHTML);
    let indexToDeleteFromAll = cars.findIndex(obj => obj.id == carId);
    cars.splice(indexToDeleteFromAll, 1);
    let indexToDeleteFromCurrent = currentCars.findIndex(obj => obj.id == carId);
    if (indexToDeleteFromCurrent != -1) {
        currentCars.splice(indexToDeleteFromCurrent, 1);
    }
    deleteCar(carId);
    showSortedCars();
    return list_to_delete;
}

//EDIT
function editRecord(record) {
    const nodeList = record.parentNode.parentNode.childNodes;
    const editBar = nodeList[3];
    const infoBar = nodeList[1];
    let carId = parseInt(infoBar.childNodes[1].innerHTML);
    let carName = infoBar.childNodes[3].innerHTML;
    let carPower = parseFloat(infoBar.childNodes[5].innerHTML);
    let carPrice = parseFloat(infoBar.childNodes[7].innerHTML);
    const editedCarName = nodeList[3][0];
    const editedCarPower = nodeList[3][1];
    const editedCarPrice = nodeList[3][2];

    let indexToEdit = cars.findIndex(obj => obj.id == carId);
    if (editActive == false) {
        openEditBar(editBar, infoBar);
        editActive = true;
    } else if (editActive == true) {
        closeEditBar(editBar, infoBar);

        if (validatePowerAndPrice(editedCarPower.value, editedCarPrice.value) == false) {
            editedCarPower.value = '';
            editedCarPrice.value = '';
            editActive = false;
            return;
        }

        let finalName = carName;
        let finalPower = carPower;
        let finalPrice = carPrice;
        if (editedCarName.value == "" && editedCarPower.value == "" && editedCarPrice.value == "") {
            editActive = false;
            showSortedCars();
            return
        }

        if (editedCarName.value != "") {
            cars[indexToEdit]["name"] = editedCarName.value;
            finalName = editedCarName.value;
        } else {
            cars[indexToEdit]["name"] = carName;
        }
        if (editedCarPower.value != "") {
            cars[indexToEdit]["powerInHP"] = parseFloat(editedCarPower.value);
            finalPower = parseFloat(editedCarPower.value);
        } else {
            cars[indexToEdit]["powerInHP"] = carPower;
        }
        if (editedCarPrice.value != "") {
            cars[indexToEdit]["priceInUSD"] = parseFloat(editedCarsPrice.value);
            finalPrice = parseFloat(editedCarPrice.value);
        } else {
            cars[indexToEdit]["priceInUSD"] = carPrice
        }

        if (searchBar.value != '' && editedCarName.value != '' && editedCarName.value.includes(searchBar.value) == false) {
            let indexToDeleteFromCurrent = currentCars.findIndex(obj => obj.id == carId);
            currentCars.splice(indexToDeleteFromCurrent, 1);
        }

        const jsonCar = createJSON(finalName, finalPower, finalPrice)
        editCar(carId, jsonCar)
        editActive = false;
        showSortedCars();
    }
}

function openEditBar(editBar, infoBar) {
    editBar.classList.add('open');
    editBar.classList.remove('hide');
    infoBar.classList.add('hide');
    infoBar.classList.remove('open');
}

function closeEditBar(editBar, infoBar) {
    editBar.classList.add('hide');
    editBar.classList.remove('open');
    infoBar.classList.add('open');
    infoBar.classList.remove('hide');
}

//CREATE
async function createCar() {
    if (validateFormRequirements(createCarName.value, createCarPower.value, createCarPrice.value) == false) {
        return;
    }
    if (validatePowerAndPrice(createCarPower.value, createCarPrice.value) == false) {
        return;
    }

    const jsonCar = createJSON(createCarName.value, createCarPower.value, createCarPrice.value);
    await postCar(jsonCar);
    showSortedCars();
    return jsonCar;
}
async function postCar(newCar) {
    let response = await fetch(cars_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(newCar)
    }).then(response => response.json()).then(data => cars.push(data))
    return response;
}


async function deleteCar(id) {
    let response = await fetch(cars_url + '/' + id, {
        method: 'DELETE',
    })
    return response;
}
async function editCar(id, editedCar) {
    fetch(cars_url + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(editedCar)
    })
}

function createJSON(name, power, price) {
    let createdCar = {
        "name": name,
        "powerInHP": parseFloat(power),
        "priceInUSD": parseFloat(price)
    }
    return createdCar;
}

function validatePowerAndPrice(power, price) {
    if (parseFloat(power) <= 0) {
        alert('power cannot be less then zero');
        return false;
    }
    if (parseFloat(price) <= 0) {
        alert('price cannot be less then zero');
        return false;
    }
    return true;
}

function validateFormRequirements(name, power, price) {
    if (name == '') {
        alert('name field is requiered')
        return false;
    }
    if (power == '') {
        alert('power field is requiered');
        return false;
    }
    if (price == 0) {
        alert('price  field is requiered');
        return false;
    }
    return true;
}

fetchData(cars_url);