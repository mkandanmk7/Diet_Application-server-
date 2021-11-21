const route = require("express").Router();
const service = require("../Services/UsersService");

route.post("/register", service.registerUser);

module.exports = route;
