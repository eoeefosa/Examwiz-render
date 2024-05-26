// models/Subscription.js
import { Schema, model } from 'mongoose';

const subscriptionSchema = new Schema({
  email: { type: String, required: true, unique: true },
});

const Subscription = model('Subscription', subscriptionSchema);
export default Subscription;
