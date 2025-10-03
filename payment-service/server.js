import express from "express";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 8080;
import amqp from "amqplib";
var amqpConn = null;

amqp.connect(process.env.RABBIT_URL + "?heartbeat=60", function (err, conn) {
    if (err) {
        console.error(err.message);
    }
    conn.on("error", function (err) {
        console.error("AMQP conn error", err.message);
        
    });
    conn.on("close", function () {
        console.error("AMQP reconnecting");
    });
    amqpConn = conn;
});


export default amqpConn;



app.use(express.json());

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
