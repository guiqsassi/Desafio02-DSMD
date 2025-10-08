import amqp from "amqplib";
import "dotenv/config";
import paymentModel from "../model/paymentModel.js";

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    const conn = await amqp.connect(process.env.RABBIT_URL + "?heartbeat=60",);
    this.connection = conn;
    this.channel = await this.connection.createChannel();
    await this.consumeApprovePayment()
  }

  async sendMessage(queue, message) {
    if (!this.channel) {
      return false;
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      console.log("mensagem enviada")
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      return true;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error.message);
      return false;
    }
  }

  async consumeApprovePayment() {
    try {
        await this.channel.assertQueue("approve-payment", {
            durable: true
        });
        this.channel.prefetch(1);

        this.channel.consume("approve-payment", async (message) => {
            if (message) {
                const content = JSON.parse(message.content) ;
                await paymentModel.approvePayment(content).then(r=>{
                  console.log(r)
                  this.channel.ack(message);

                }).catch(e=>{
                  console.log("erro ao processar requisição: "+ e.message)
                });
            }
        },);

    } catch (error) {
        console.error('Erro ao consumir mensagens:', error);
        
    }

  }
}


export default new RabbitMQService();
