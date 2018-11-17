# smartcarAPIchallenge
middle tier API used for access to GM API. Provides cleaner/user friendly JSON response of GM data. (Specifications provided)

## Technologies Used
* Node.js with express framework and Mocha/Chai as testing framework

## How to Use
* Install Node.js and npm via: https://nodejs.org/en/
* within root directory `npm test` in order to run test cases found in 'test' folder. (timeout may occur on first attempt)
* within root directory `node server.js` to run server and access API

## Broad Design Choices
* exported each router function to separate files and stored in `routes` folder for organization. Also allowed me to create the GM Http request Object within app.js and update specific parts of the request body within each router. 
* In cases where user input made it to the GM API request, I responded with GM error response to retain GM information.
* In other cases, such as user input sanitization, I responded with custom error response but closely followed GM's style.
* Modularized error responses

## Specific Design Choices
* for fuel/battery type, I returned error if the energy type did not match the vehicle and sent a response of '400'
* converted all vehicle ID to string to minimize chance of overflow and replied '400' if ID exceeded 1000 characters.
* custom error response for large payload/invalid json.

## Challenges
* Learning express, Mocha/Chai framework (fairly new to it), and figuring out how to design the project space. 
* Current testing methods only check elements of response JSON (such as: check status and reason elements exist for error objects returned). Still need to figure out how to perform Mock/Unit testing because GM API sends constantly changing/unpredictable responses for certain API routes which can't be thoroughly tested against.
* very fun challenge to work on!

