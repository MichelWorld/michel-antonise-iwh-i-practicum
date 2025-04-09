require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.


// * Code for Route 1 goes here
app.get('/', async (req, res) => {

    const cars = 'https://api.hubspot.com/crm/v3/objects/cars?properties=name,brand,type,number_of_kms';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(cars, { headers });
        const data = resp.data.results;
        res.render('cars', { title: 'My Cars? | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/cars/add', async (req, res) => {

    // const cars = 'https://api.hubspot.com/crm/v3/objects/cars?properties=name,brand,type,number_of_kms,hs_object_id';
    // const headers = {
    //     Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    //     'Content-Type': 'application/json'
    // }
    try {
        //const resp = await axios.get(cars, { headers });
        //const data = resp.data.results;
        res.render('cars_add', { title: 'Add a car | HubSpot APIs' });      
    } catch (error) {
        console.error(error);
    }
});

// * Code for Route 2 goes here
// Route to add a new car (form + processing) ?
app.post('/cars/add', async (req, res) => {
    const { name, brand, type, number_of_kms } = req.body;

    const createCarUrl = 'https://api.hubspot.com/crm/v3/objects/cars';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newCar = {
        properties: {
            name,
            brand,
            type,
            number_of_kms
        }
    };

    try {
        await axios.post(createCarUrl, newCar, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error adding car:', error.response?.data || error.message);
        res.status(500).send('Failed to add car');
    }
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
// form + 
// * Code for Route 3 goes here
// Route to edit an existing car
app.post('/cars/edit/:id', async (req, res) => {
    const carId = req.params.id;
    const { name, brand, type, number_of_kms } = req.body;

    const updateCarUrl = `https://api.hubspot.com/crm/v3/objects/cars/${carId}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const updatedCar = {
        properties: {
            name,
            brand,
            type,
            number_of_kms
        }
    };

    try {
        await axios.patch(updateCarUrl, updatedCar, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error updating car:', error.response?.data || error.message);
        res.status(500).send('Failed to update car');
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));