//coffee_shops.js module
//
// Manages the coffeeShops array, providing basic functions add, delete, update, and lookup, plus
// the findNearest which takes lat/lon inputs and finds the nearest coffee shop.
//

let nextID = 0; //when creating new IDs, this is the next available.  It is set to max id + 1 during startup.

let coffeeShops = [];   //an array of CoffeeShop objects

class CoffeeShop {
    constructor(id, name, address, lat, lon) {
        if (id < 0) {
            this.id = nextID;
            nextID++;
        }
        else {
            this.id = id;
        }
        this.name = name;
        this.address = address;
        this.lat = lat;
        this.lon = lon;
    }
}

//lookup a coffee shop given its id
function lookup(id) {
    const shop = coffeeShops.find(c => c.id === id);
    if (shop) {
        return shop;
    }
    else {
        return undefined;
    }
}

function add(id, name, address, lat, lon) {
    //should look for duplicate entry first, but not part of spec so won't worry about it.  Would either treat like error, or just update instead of create.

    const newShop = new CoffeeShop(id, name, address, lat, lon);
    coffeeShops.push(newShop);
    return newShop.id;
}

// Convert Degress to Radians
function deg2Rad( deg ) {
    return deg * Math.PI / 180;
}

//calculate distance using pythagoras
function calculateDistance(lat1, lon1, lat2, lon2) {
    lat1 = deg2Rad(lat1);
    lat2 = deg2Rad(lat2);
    lon1 = deg2Rad(lon1);
    lon2 = deg2Rad(lon2);
    var x = (lon2-lon1);
    var y = (lat2-lat1);
    var d = Math.sqrt(x*x + y*y);
    return d;
}

//find the nearest coffee shop from the specified coordinates (lat & lon)
function findNearest(lat, lon) {
    let shortestDistance = 99999; //initialize to a very large number
    let closest = '';
    coffeeShops.forEach(c => {
        let distance = calculateDistance(lat, lon, c.lat, c.lon);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            closest = c.name;
        }
    });
    return closest;
}

function update(id, name, address, lat, lon) {
    //find the coffee shop based on ID
    const shop = coffeeShops.find(c => c.id === id);
    if (!shop) {
        return undefined;
    }

    //a match was found, so update the coffee shop
    shop.name = name;
    shop.address = address;
    shop.lat = lat;
    shop.lon = lon;

    return shop.id;
}

function deleteCoffeeShop(id) {
    //find the coffee shop to delete by ID
    const shopIndex = coffeeShops.findIndex(c => c.id === id);
    if (shopIndex < 0) {
        //no match was found
        return undefined;
    }
    else {
        //a match was found, so delete it
        coffeeShops.splice(shopIndex, 1);
        return id;
    }
}

function getAll() {
    return coffeeShops;
}

function initNextID() {
    //set "nextID" to the max ID + 1, so that newly created coffee shops are given unique IDs > exiting IDs.
    coffeeShops.forEach(function (coffeeShop) {
        if (nextID < coffeeShop.id) {
            nextID = coffeeShop.id;
        }
    });
    nextID++;
}

module.exports.initNextID = initNextID;
module.exports.lookup = lookup;
module.exports.add = add;
module.exports.update = update;
module.exports.delete = deleteCoffeeShop;
module.exports.findNearest = findNearest;
