// linking and requiring everything 
const express = require("express");
const app = express();
const restaurantRouter = express.Router();
const Restaurant = require("../models/Restaurant");

// include check and validationResult
const { check, validationResult } = require("express-validator"); // express-validator is what is put in the terminal to run the test

// const { router } = require("../src/app");

// think of a router like a dropdown menu that houses everything within that category rather than having loads of different tabs of each individual thing
// e.g resturants contains nandos, burger king, orange tree rather than having loads of seperate tabs for each restaurant 


restaurantRouter.use(express.json()); // parses JSON request and makes the data available in req.body
restaurantRouter.use(express.urlencoded({extended: true})); // parses URL and makes the data available in req.boy

// get just gets the info
restaurantRouter.get("/", async (request, response) => {
    const restaurants = await Restaurant.findAll({});
    response.json(restaurants); // returns all the info
})

// gets the info by the id name
restaurantRouter.get("/:id", async (request, response) => {
    const number = request.params.id;
    const restaurant = await Restaurant.findByPk(number);
    response.json(restaurant) // returns the info with that specific id 
})

// restaurantRouter.post("/", async (request, response) => {
//     const restaurant = await Restaurant.create(request.body);
//     const newRestaurant = await Restaurant.findAll({})
//     response.json(newRestaurant)
// })

// put updates the info
restaurantRouter.put("/:id", async (request, response) => {
    const updatedRestaurants = await Restaurant.update(request.body, {where: {id: request.params.id}});
    let restaurants = await Restaurant.findAll()
    response.json(restaurants);
})

// deletes the info 
restaurantRouter.delete("/:id", async (request, response) => {
    const deletedRestaurant = await Restaurant.destroy({where: {id: request.params.id}});
    let restaurants = await Restaurant.findAll()
    response.json(restaurants)
})



// //check for name 
// restaurantRouter.post("/", [check("name").not().isEmpty().trim()], (req, res) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         res.json({error: errors.array()})
//     }
//     else{
//         const newRestaurant = req.body;
//         restaurants.push(newRestaurant);
//         res.json(restaurants)
//     }
// })

// //check for location
// restaurantRouter.post("/", [check("location").not().isEmpty().trim()], (req, res) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         res.json({error: errors.array()})
//     }
//     else{
//         const newRestaurant = req.body;
//         restaurants.push(newRestaurant);
//         res.json(restaurants)
//     }
// })

// //check cuisine 
// restaurantRouter.post("/", [check("cuisine").not().isEmpty().trim()], (req, res) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         res.json({error: errors.array()})
//     }
//     else{
//         const newRestaurant = req.body;
//         restaurants.push(newRestaurant);
//         res.json(restaurants)
//     }
// })

// post creates info
// checks all post - combine all posts together 
restaurantRouter.post("/", 
    [
        check("name").not().isEmpty().trim().withMessage("Name is required"),
        check("location").not().isEmpty().trim().withMessage("Location is required"),
        check("cuisine").not().isEmpty().trim().withMessage("Cuisine is required")
    ],
    async (request, response) => {
    const errors =validationResult(request);
        if(!errors.isEmpty()){
            response.json({error: errors.array()})
        }
        else{
            const restaurant = await Restaurant.create(request.body);
            const newRestaurant = await Restaurant.findAll({})
            response.json(newRestaurant)
        }
})

module.exports = restaurantRouter