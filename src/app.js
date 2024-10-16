const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");

//TODO: Create your GET Request Route Below: 

const restaurantRouter = require("../routes/restaurants")

app.use(express.json());
app.use(express.urlencoded());
app.use("/restaurants", restaurantRouter)

app.get("/restaurants", async (request, response) => {
    const restaurants = await Restaurant.findAll({});
    response.json(restaurants);
})

app.get("/restaurants/:id", async (request, response) => {
    const number = request.params.id;
    const restaurant = await Restaurant.findByPk(number);
    response.json(restaurant)
})

app.post("/restaurants", async (request, response) => {
    const newRestaurant = await Restaurant.create(request.body);
    response.json(newRestaurant)
})

app.put("/restaurants/:id", async (request, response) => {
    const updatedRestaurants = await Restaurant.update(request.body, {where: {id: request.params.id}});
    response.json(updatedRestaurants);
})

app.delete("/restaurants/:id", async (request, response) => {
    const deletedRestaurant = await Restaurant.destroy({where: {id: request.params.id}});
    response.json(deletedRestaurant)
})


module.exports = app;