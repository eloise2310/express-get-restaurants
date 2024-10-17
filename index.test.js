const request = require("supertest");
const app = require("./src/app.js");
const Restaurant = require("./models");
const syncSeed = require("./seed.js");

let restaurantAmount;

beforeAll(async () => {
    await syncSeed();
    const restaurants = await Restaurant.findAll({});
    restaurantAmount = restaurants.length;
})

//200 is the correct resonse code so we want the response status code to equal 200
test("should return 200 on get", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toEqual(200)
})

// we want it to return the full array of restaurants 
test("should return an array of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(Array.isArray(response.body)).toBe(true); //this ensures that the body > is an array > is true 
    expect(response.body[0]).toHaveProperty("cuisine"); // this ensures that within the body there is a property names cusine ( we could but name or location here too!)
})

// we want to make sure that the data returning matches with what we expect
test("should return the correct restuarant data", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.body).toContainEqual(
        expect.objectContaining({
            id: 1,
            name: "AppleBees",
            location: "Texas",
            cuisine: "FastFood",
        })
    )
})

// we have added a /1 to the end of "/restaurants/1" (finding the id with 1) so we want to make sure that it returns the correct things of /1
test("should return the correct restuarant", async () => {
    const response = await request(app).get("/restaurants/1");
    expect(response.body).toEqual(
        expect.objectContaining({
            id: 1,
            name: "AppleBees",
            location: "Texas",
            cuisine: "FastFood",
        })
    )
})

// if we send that info and post it into /restaurants, the restaurantAmount should increase by 1
test("should return larger resturant array", async () => {
    const response = await request(app)
    .post("/restaurants")
    .send({ name: "orangeTree", location: "Denton", cuisine: "tapas"});
    expect(response.body.length).toEqual(restaurantAmount + 1)
})

// if we send info and put it in restaurants/1 it should replace that original info with the info we are sending
test("should update first item in database", async () => {
    await request(app)
    .put("/restaurants/1")
    .send({ name: "orangeTree", location: "Denton", cuisine: "tapas"})
})

// deleting a restaurant from the arra would put the restaurantAmount back to the original amount (not -1) as we added one (+1) above in the larger array test
test("should delete db entry by id", async () => {
    await request(app).delete("/restaurants/1");
    const restaurants = await Restaurant.findAll({});
    expect(restaurants.length).toEqual(restaurantAmount);
    expect(restaurants[0].id).not.toEqual(1)
})

// if name is left empty we should get an error message (must match error message in restaurants.js)
// because we are testing an error, we want the statusCode to be 200 to show that the error test is correct
test("should return an error when name is empty", async () => {
    const response = await request(app)
    .post("/restaurants")
    .send({ name: "", location: "Denton", cuisine: "tapas"});
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
        error: [
            {
                value: "",
                msg: "Name is required",
                path: "name",
                location: "body",
                type: "field"
            }
        ]
    })
})

// same as above with location
test("should return an error when location is empty", async () => {
    const response = await request(app)
    .post("/restaurants")
    .send({ name: "orangetree", location: "", cuisine: "tapas"});
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
        error: [
            {
                value: "",
                msg: "Location is required",
                path: "location",
                location: "body",
                type: "field"
            }
        ]
    })
})

// same as above with cuisine
test("should return an error when cuisine is empty", async () => {
    const response = await request(app)
    .post("/restaurants")
    .send({ name: "orangeTree", location: "Denton", cuisine: ""});
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
        error: [
            {
                value: "",
                msg: "Cuisine is required",
                path: "cuisine",
                location: "body",
                type: "field"
            }
        ]
    })
})



