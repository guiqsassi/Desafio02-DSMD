import amqp from "amqplib";
import "dotenv/config";

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    const conn = await amqp.connect(process.env.RABBIT_URL + "?heartbeat=60");
    this.connection = conn;
    this.channel = await this.connection.createChannel();
    await this.consumeNotification();
  }

  async sendMessage(queue, message) {
    if (!this.channel) {
      return false;
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      console.log("mensagem enviada");
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      return true;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error.message);
      return false;
    }
  }

  async consumeNotification() {
    try {
      await this.channel.assertQueue("notification", {
        durable: true,
      });
      this.channel.prefetch(1);

      this.channel.consume("notification", async (message) => {
        console.log("Mensagem recebida:", message.content.toString());
        

        const content = JSON.parse(message.content);

        if(content.status == "Pending"){
          console.log("Solicitação de Trasanção de: " + content.username + " recebido com sucesso")
          content.status = "Completed";
          this.sendMessage("approve-payment", content).then(r=>{
            this.channel.ack(message);
            console.log("mensagem de approve-payment enviada")
          }).catch(e=>{
            console.log("erro ao enviar mensagem de approve-payment: "+ e.message)
          });
        }
        else if(content.status == "Completed"){
          console.log("Transação concluida com sucesso!")

        }


      });
    } catch (error) {
      console.error("Erro ao consumir mensagens:", error);
    }
  }
}

export default new RabbitMQService();
