// app.js starts up the service and processes the API endpoints:
// lookup - /api/coffeeshop/lookup POST
// create - /api/coffeeshop/create POST
// update - /api/coffeeshop/update PUT
// delete - /api/coffeeshop/delete DELETE
// nearest - /api.coffeeshop/nearest
//
// The "nearest" endpoint uses Google maps Geocode service
// JSON validation is performed using the Joi class
// The coffee shops info is managed in the coffee_shops.js module

const express = require('express');
const fs = require('fs');   //file system
const app = express();
const Joi = require('joi'); //import the Joi class for JSON validation.

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAw6lXO9Pg_mMLuNg-NFXvqTodU0jUEBKs'
});

app.use(express.json());

//access control headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//local modules
const cs = require('./coffee_shops');


//LOOKUP endpoint: look up a coffee shop by ID
app.post('/api/coffeeshop/lookup', (req, res) => {
    //validate the JSON request using the Joi package
    const schema = {
        id: Joi.number().integer().required()
    };
    const {error} = Joi.validate(req.body, schema);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //find the coffee shop
    const shop = cs.lookup(req.body.id);
    if (shop) {
        //a match was found
        res.send(shop);
    }
    else {
        //no match was found
        res.status(404).send('No coffee shop with the given ID was found.');
    }
});


//CREATE endpoint: add a new coffee shop
app.post('/api/coffeeshop/create', (req, res) => {
    //validate the JSON request using the Joi package
    const schema = {
        name: Joi.string().required(),
        address: Joi.string().min(3).required(),
        lat: Joi.number().min(-90).max(90).required(),
        lon: Joi.number().min(-180).max(180).required(),
    };
    const {error} = Joi.validate(req.body, schema);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const newShopId = cs.add(-1, req.body.name, req.body.address, req.body.lat, req.body.lon);

    res.send({id: newShopId});
});


//NEAREST endoint: find nearest coffee shop
app.post('/api/coffeeshop/nearest', (req, res) => {
    //validate the JSON request using the Joi package
    const schema = {
        address: Joi.string().min(3).required(),
    };
    const {error} = Joi.validate(req.body, schema);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Use the Google service to Geocode an address.
    googleMapsClient.geocode({
        address: req.body.address
    }, function (err, response) {
        if (err) {
            return res.status(400).send(err.message);
        }
        else {
            let fromLat = response.json.results[0].geometry.location.lat;
            let fromLon = response.json.results[0].geometry.location.lng
            let closestCoffeeShop = cs.findNearest(fromLat, fromLon);

            res.send({name: closestCoffeeShop});
        }
    });
});

//UPDATE endpoint: update coffee shop by id
app.put('/api/coffeeshop/update', (req, res) => {
    //validate the JSON request using the Joi package
    const schema = {
        id: Joi.number().integer().required(),
        name: Joi.string().required(),
        address: Joi.string().min(3).required(),
        lat: Joi.number().min(-90).max(90).required(),
        lon: Joi.number().min(-180).max(180).required(),
    };
    const {error} = Joi.validate(req.body, schema);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let matchId = cs.update(req.body.id, req.body.name, req.body.address, req.body.lat, req.body.lon);
    if (matchId) {
        res.send({id: matchId});
    }
    else {
        //no match was found
        res.status(404).send('No coffee shop with the given ID was found to update.');
    }
});

//DELETE endpoint: delete coffee shop
app.delete('/api/coffeeshop/delete', (req, res) => {
    //validate the JSON request using the Joi package
    const schema = {
        id: Joi.number().integer().required()
    };
    const {error} = Joi.validate(req.body, schema);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //find the coffee shop to delete by ID
    const matchId = cs.delete(req.body.id);
    if (matchId) {
        //a match was found, so delete it
        res.send({id: matchId});
    }
    else {
        //no match was found
        res.status(404).send('No coffee shop with the given ID was found to delete.');
    }
});


/*** MAIN STARTUP ***/
/*
 Load the coffee shops data from a file.  Since this is on startup, use synchronous read call so it completes before listening
 Line format:
   id is lineElements[0],
   name is lineElements[1],
   address is lineElements[2],
   lat is lineElements[3],
   lon is lineElements[4]

   Assuming the data in the file is valid, so not validating it.
*/
let data;
try {
    data = fs.readFileSync('locations.csv', 'utf8');
}
catch(err) {
    console.log(err.message);
    process.exit(1);
}
const content = data.split('\n');
content.forEach(function (element) {
    let lineElements = element.split(',');
    cs.add(parseInt(lineElements[0]), lineElements[1], lineElements[2], parseFloat(lineElements[3]), parseFloat(lineElements[4]));
});

cs.initNextID();

//Listen for requests
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
