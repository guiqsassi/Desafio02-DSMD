import express from "express";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 8080;
import RabbitMqService from "./services/RabbitMqService.js";
import paymentRoute from "./routes/paymentRoute.js";
import paymentModel from "./model/paymentModel.js";

await RabbitMqService.connect();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(paymentRoute);

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
