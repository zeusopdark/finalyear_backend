const paymentControllers = require("../controllers/paymentControllers.js")

const express = require("express");
const paymentRoute = express.Router();

paymentRoute.get("/getKey", paymentControllers.getKey);
paymentRoute.post("/checkout", paymentControllers.checkout)
paymentRoute.post("/paymentVerification", paymentControllers.paymentVerification);

module.exports = paymentRoute;