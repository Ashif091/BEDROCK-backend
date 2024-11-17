import mongoose from "mongoose"

const SubscriptionSchema = new mongoose.Schema({
  plan: {type: String, required: true},
  price: {type: Number, required: true},
  available_workspace: {type: Number, required: true},
})

export const Subscription = mongoose.model("Subscription", SubscriptionSchema)
