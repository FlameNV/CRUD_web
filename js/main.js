const carList = document.getElementById('cars-list');
const searchBar = document.getElementById('find-car');
const clearButton = document.getElementById('clear-search-bar');


let cars = [{
        id: 1,
        name: "Audi RS6 Avant",
        powerInHP: 600,
        priceInUSD: 80000
    },
    {
        id: 2,
        name: "Tesla Model S",
        powerInHP: 750,
        priceInUSD: 45000
    },
    {
        id: 3,
        name: "BMW M3",
        powerInHP: 430,
        priceInUSD: 40000
    },
    {
        id: 4,
        name: "LADA 2101",
        powerInHP: 80,
        priceInUSD: 1000
    },
    {
        id: 5,
        name: "VW Passat B7",
        powerInHP: 150,
        priceInUSD: 12000
    },
    {
        id: 6,
        name: "VW Golf VI",
        powerInHP: 120,
        priceInUSD: 9000
    },
    {
        id: 7,
        name: "Toyota Corola",
        powerInHP: 160,
        priceInUSD: 13000
    }
]
let currentCars = cars;

searchBar.addEventListener('keyup', (searchString) => {
    const searchFilterString = searchString.target.value.toLowerCase();
    const filteredCars = cars.filter(car => {
        return car.name.toLowerCase().includes(searchFilterString);
    });
    currentCars = filteredCars;
    showSortedCars();
})

clearButton.addEventListener('click', () => {
    searchBar.value = '';
    currentCars = cars;
    showSortedCars();
})

// function to calculate price of current displaying items
function calculatePrice() {
    var priceSum = 0;
    var totalPriceLabel = document.getElementById('total-price');
    currentCars.forEach(car => priceSum += car.priceInUSD);
    totalPriceLabel.textContent = 'Total price: ' + priceSum + '$';
}

// sort if needed and display items
function showSortedCars() {
    var sortType = document.getElementById('sort-select').value;
    console.log(sortType);
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

// function to show current gems
const displayCars = (carsToShow) => {
    const htmlString = carsToShow.map((car) => {
        return `
        <li class="car">
            <h2>${car.name}</h2>
            <h3> Power: ${car.powerInHP} HP</h3>
            <h3> Price: ${car.priceInUSD} $</h3>
            <div class= "control-buttons">
                <button class="edit-button" id="edit-button" onclick="editRecord(this)">Edit</button>
                <button class="delete-button" id="delete-button" onclick="deleteRecord(this)">Delete</button>
            </div>
        </li>
        `
    }).join('');

    carList.innerHTML = htmlString;
}

// show all gems at the load
displayCars(currentCars)