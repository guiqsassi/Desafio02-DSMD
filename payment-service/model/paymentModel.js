import { PrismaClient } from "@prisma/client";



class PaymentModel {
    constructor(){
        this.prismaClient = new PrismaClient();
    }


    create= async (payment) => {
        return await this.prismaClient.payment.create({
            data: payment
        })
    }
}

export default new PaymentModel()