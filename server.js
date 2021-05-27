/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: _______Yuelin Wen_______________ Student ID: ____114379209__________ Date: ___May-22-2021_____________
*  Heroku Link: https://frozen-hamlet-75254.herokuapp.com/
*
********************************************************************************/

const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const cors = require('cors');
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB("mongodb+srv://q153212546:Wyl960524.@cluster0.4vbtp.mongodb.net/sample_restaurants?retryWrites=true&w=majority");


//middleware
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => {
    res.json({ message: "API Listening" });
})

app.post("/api/restaurants", (req, res) => {
    db.addNewRestaurant(req.body)
        .then((msg) => {
            res.status(201).json(msg);
        })
        .catch(err => {
            res.status(404).json(`oops! error found ` + err);
        })
});
app.get("/api/restaurants", (req, res) => {
    let page = req.query.page;
    let perPage = req.query.perPage;
    let borough = (req.query.borough) ? req.query.borough : "not given";
    db.getAllRestaurants(page, perPage, borough)
        .then(() => {
            res.status(200).json({ message: `Restaurant object is located at page ${page}, there is ${perPage} per page, and the location is ${borough}.` });
        })
        .catch(err => {
            res.status(404).json(`oops! error found ` + err);
        })
});
app.get("/api/restaurants/:id", (req, res) => {
    db.getRestaurantById(req.params.id)
        .then((resInfo) => {
            res.status(200).json(resInfo);
        })
        .catch(err => {
            res.status(404).json({ "message": "Resource not found" + err })
        })
});
app.put("/api/restaurants/:id", (req, res) => {
    db.updateRestaurantById(req.body, req.params.id)
        .then(msg => {
            res.status(200).json(msg);
        })
        .catch(err => {
            res.status(404).json({ "message": "Resource not found" + err });
        })
});
app.delete("/api/restaurants/:id", (req, res) => {
    db.deleteRestaurantById(req.params.id)
        .then(msg => {
            res.status(204).end();
        })
        .catch(err => {
            res.status(400).json({ "message": "Failed to delete, Resource not found" + err });
        });
});


// Resource not found (this should be at the end)
app.use((req, res) => {
    res.status(404).send("Resource not found");
});

// Tell the app to start listening for requests
db.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

// app.listen(HTTP_PORT, () => {
//     console.log("Ready to handle requests on port " + HTTP_PORT);
// });
