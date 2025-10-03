import { PrismaClient } from "@prisma/client";
import RabbitMqService from "../services/RabbitMqService.js";


class PaymentModel {
    constructor(){
        this.prismaClient = new PrismaClient();
    }


    create= async (payment) => {
        let result = await this.prismaClient.payment.create({
            data: {
                username: payment.username,
                status: "Pending",
                amount: BigInt(payment.amount)
            }
        });
        result =  {
            ...result,
            amount: result.amount.toString()
        }
        const isMessageSent = await RabbitMqService.sendMessage("notification", result)
        if(!isMessageSent){
            return {e: "Mensagem não enviada"}
        }
        return result;

    }
    approvePayment = async(payment)=>{
        let result = await this.prismaClient.payment.update({
            where: {
                id: payment.id
            },
            data: {
                status: "Completed",
            }
        });
        return {
            ...result,
            amount: result.amount.toString()
        }
        
    }


}

export default new PaymentModel()