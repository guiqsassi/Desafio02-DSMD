import express from "express"
import paymentController from "../controller/paymentController.js"

const paymentRoute = express.Router()


paymentRoute.post("/payment", (req,res)=>{
    paymentController.create(req, res);

})

export default paymentRoute;