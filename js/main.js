const carList = document.getElementById('cars-list');
const searchBar = document.getElementById('find-car');
const clearButton = document.getElementById('clear-search-bar');

const createCarID = document.getElementById('create_id');
const createCarName = document.getElementById('create_name');
const createCarPower = document.getElementById('create_powerInHP');
const createCarPrice = document.getElementById('create_priceInUSD');

var editActive = false;

let cars = [{
        "id": 1,
        "name": "Audi RS6 Avant",
        "powerInHP": 600,
        "priceInUSD": 80000
    },
    {
        "id": 2,
        "name": "Tesla Model S",
        "powerInHP": 750,
        "priceInUSD": 45000
    },
    {
        "id": 3,
        "name": "BMW M3",
        "powerInHP": 430,
        "priceInUSD": 40000
    },
    {
        "id": 4,
        "name": "LADA 2101",
        "powerInHP": 80,
        "priceInUSD": 1000
    },
    {
        "id": 5,
        "name": "VW Passat B7",
        "powerInHP": 150,
        "priceInUSD": 12000
    },
    {
        "id": 6,
        "name": "VW Golf VI",
        "powerInHP": 120,
        "priceInUSD": 9000
    },
    {
        "id": 7,
        "name": "Toyota Corola",
        "powerInHP": 160,
        "priceInUSD": 13000
    }
]
let currentCars = cars;

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

function deleteRecord(element) {
    console.log(element);
}

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

function deleteRecord(record) {
    const list_to_delete = record.parentNode.parentNode;
    let carId = parseInt(list_to_delete.childNodes[1].childNodes[1].innerHTML);
    let indexToDeleteFromAll = cars.findIndex(obj => obj.id == carId);
    cars.splice(indexToDeleteFromAll, 1);
    if (searchBar.value != '') {
        let indexToDeleteFromCurrent = currentCars.findIndex(obj => obj.id == carId);
        console.log(indexToDeleteFromCurrent);
        currentCars.splice(indexToDeleteFromCurrent, 1);
    }
    showSortedCars();
    console.log(cars, currentCars);
    return list_to_delete;
}

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
        editBar.classList.add('open');
        editBar.classList.remove('hide');
        infoBar.classList.add('hide');
        infoBar.classList.remove('open');
        editActive = true
    } else if (editActive == true) {
        editBar.classList.add('hide');
        editBar.classList.remove('open');
        infoBar.classList.add('open');
        infoBar.classList.remove('hide');

        if (validatePowerAndPrice(editedCarPower.value, editedCarPrice.value) == false) {
            editedCarPower.value = '';
            editedCarPrice.value = '';
            return;
        }

        if (editedCarName.value != "") {
            cars[indexToEdit]["name"] = editedCarName.value;
        } else {
            cars[indexToEdit]["name"] = carName;
        }
        if (editedCarPower.value != "") {
            cars[indexToEdit]["powerInHP"] = parseFloat(editedCarPower.value);
        } else {
            cars[indexToEdit]["powerInHP"] = carPower;
        }
        if (editedCarPrice.value != "") {
            cars[indexToEdit]["priceInUSD"] = parseFloat(editedCarsPrice.value)
        } else {
            cars[indexToEdit]["priceInUSD"] = carPrice
        }

        editActive = false;
        showSortedCars();
    }
}

function createCar() {
    if (validateFormRequirements(createCarID.value, createCarName.value, createCarPower.value, createCarPrice.value) == false) {
        console.log('error');
        return;
    }
    if (validatePowerAndPrice(createCarPower.value, createCarPrice.value) == false) {
        console.log('error');
        return;
    }
    let json = createJSON(createCarID.value, createCarName.value, createCarPower.value, createCarPrice.value);

    cars.push(json)

    showSortedCars();
    return json;
}

function createJSON(id, name, power, price) {
    let createdCar = {
        "id": parseInt(id),
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

function validateFormRequirements(id, name, power, price) {
    if (id == '') {
        alert('id field is requiered')
        return false;
    }
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

displayCars(currentCars)