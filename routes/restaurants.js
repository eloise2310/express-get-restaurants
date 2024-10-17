const express = require("express");
const app = express();
const restaurantRouter = express.Router();
const Restaurant = require("../models/Restaurant");

// include check and validationResult
const { check, validationResult } = require("express-validator");

// const { router } = require("../src/app");

restaurantRouter.use(express.json());
restaurantRouter.use(express.urlencoded({extended: true}));


restaurantRouter.get("/", async (request, response) => {
    const restaurants = await Restaurant.findAll({});
    response.json(restaurants);
})

restaurantRouter.get("/:id", async (request, response) => {
    const number = request.params.id;
    const restaurant = await Restaurant.findByPk(number);
    response.json(restaurant)
})

// restaurantRouter.post("/", async (request, response) => {
//     const restaurant = await Restaurant.create(request.body);
//     const newRestaurant = await Restaurant.findAll({})
//     response.json(newRestaurant)
// })

restaurantRouter.put("/:id", async (request, response) => {
    const updatedRestaurants = await Restaurant.update(request.body, {where: {id: request.params.id}});
    let restaurants = await Restaurant.findAll()
    response.json(restaurants);
})

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

// checks all post
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