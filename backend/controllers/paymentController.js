import { Product, Order } from "../models";
import { CustomErrorHandler } from "../services";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_API_SECRET);

const paymentController = {
    // Process Payment
    async processPayment(req, res, next) {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency:"inr",
            metadata:{
                company:'ecomNode'
            }
        });        
        res.status(200).json({ success: true, client_secret: myPayment.client_secret });
    },

    // Send Stripe Api Key
    async sendStripeApiKey(req, res, next) {
        res.status(200).json({ success: true, stripeApiKey: process.env.STRIPE_API_KEY });
    }
}


export default paymentController;