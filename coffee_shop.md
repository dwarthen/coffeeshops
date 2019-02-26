coffeeshops<br><br>
A JSON RESTful service in node.js to maintain a list of coffee shops and to find the nearest one to an input address.

This is a change... playing with github.

It consists of three files:
app.js - starts the service and handles the endpoints
coffee_shops.js - manages the coffee shop info repository
locations.csv - the coffee shop info loaded on startup

Dependencies:<br>
npm install express<br>
npm install joi<br>
npm install @google/maps<br>
(If you are using an older version of npm, add the --save option.)

To run: node app.js<br>

The service listens on port 3000 by default, or on the port specified in the PORT environment variable.

JSON Endpoints:<br>

LOOKUP: <br>  Request: POST /api/coffeeshop/lookup { id: integer } <br>  response: { id: integer, name: string, address: string, lat: real, lon: real }<br>

CREATE:<br> Request: POST /api/coffeeshop/create { id: integer, name: string, address: string, lat: real, lon: real } <br>Response: { id: integer }<br>

UPDATE:<br> Request: PUT /api/coffeeshop/update { id: integer, name: string, address: string, lat: real, lon: real }<br> Response: { id: integer }<br>

DELETE:<br> Request: DELETE /api/coffeeshop/delete { id: integer } <br>Response: { id: integer } <br>

FIND NEAREST: <br>Request: POST /api/coffeeshop/nearest { address: string } <br>Response: { name: string }<br>

ERRORS - When errors are encountered, such a an invalid ID or invalid LAT/LON, a 404 error is returned with an explanatory message.
