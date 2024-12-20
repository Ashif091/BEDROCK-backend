import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { price } = req.body;
    console.log("🚀 ~ router.post ~ price in payment route:", price)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Stripe expects the amount in cents
      currency: 'usd',
      // receipt_email:"fhyvhh091@gmail.com"
    });
    console.log("🚀 ~ router.post ~ paymentIntent:", paymentIntent)

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the payment intent' });
  }
});

export default router;