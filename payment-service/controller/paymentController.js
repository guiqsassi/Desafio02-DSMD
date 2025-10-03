import paymentModel from "../model/paymentModel.js";

class PaymentController {

    create = async(req, res) =>{
        await paymentModel.create(req.body).then(r=>{
            res.json({data: r})
        }).catch(e=>{
            res.json({error: e.message})
        })
    }

}

export default new PaymentController();