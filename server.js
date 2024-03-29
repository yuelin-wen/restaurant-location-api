
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const cors = require('cors');
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB("mongodb+srv://dbUser:Wyl96524@cluster0.6av08.mongodb.net/sample_restaurants?retryWrites=true&w=majority");


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
    db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
        .then((data) => {
            res.status(200).json(data);
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
