import * as express from "express";
import * as http from "http";
import { soap } from "soap-decorators";
import { PaymentController } from "./controllers/PaymentController";

const app = express();
const paymentController = new PaymentController();
const port = process.env["PORT"] || 3100;

app.use("/payment", soap(paymentController));

http.createServer(app).listen(port, () => console.log("Soap server listening"));
