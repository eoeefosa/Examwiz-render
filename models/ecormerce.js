"use strict";
import { Schema , Types, model } from "mongoose";
// const Schema = _Schema;

const userSchema = new Schema({
  userid: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  user_role: { type: String, default: "USER", required: true },
  passwordhash: { type: String, required: true },
  registered_at: { type: Date, required: true },
  user_ip: { type: String },
  active: { type: Boolean, default: false, required: true },
  token: { type: String, unique: true },
  expiry: { type: String },
});
userSchema.index({ userid: 1 });

const userAddressSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userid: { type: String, required: true, ref: "User" },
  address_line1: { type: String },
  address_line2: { type: String },
  city: { type: String },
  postal_code: { type: String },
  country: { type: String },
  telephone: { type: String },
  mobile: { type: String },
});
userAddressSchema.index({ userid: 1 });

const userPaymentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userid: { type: String, required: true, ref: "User" },
  payment_type: { type: String, required: true },
});
userPaymentSchema.index({ userid: 1 });

const productSchema = new Schema({
  pid: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  created_at: { type: Date, required: true },
  summary: { type: String, required: true },
  price: { type: Types.Decimal128, required: true },
});
productSchema.index({ pid: 1 });

const inventorySchema = new Schema({
  id: { type: String, required: true, unique: true, ref: "Product" },
  quantity: { type: Number },
});
inventorySchema.index({ id: 1 });

const productCategorySchema = new Schema({
  id: { type: String, required: true, unique: true, ref: "Product" },
  name: { type: String, required: true },
});
productCategorySchema.index({ id: 1 });

const discountSchema = new Schema({
  id: { type: String, required: true, unique: true, ref: "Product" },
  coupon: { type: String, required: true },
  description: { type: String },
  discount_percent: { type: Types.Decimal128 },
  active: { type: Boolean, default: false, required: true },
  created_at: { type: Date, required: true },
});
discountSchema.index({ id: 1 });

const productRatingSchema = new Schema({
  pratingid: { type: String, required: true, unique: true },
  userid: { type: String, required: true, ref: "User" },
  pid: { type: String, required: true, ref: "Product" },
  rating: { type: Number, required: true },
  date_created: { type: Date, required: true },
});
productRatingSchema.index({ pid: 1 });

const ratingSchema = new Schema({
  rid: { type: String, required: true, unique: true },
  pid: { type: String, ref: "Product" },
  userid: { type: String, ref: "User" },
  rating_number: { type: Number, required: true },
  comment: { type: String, required: true },
  submitted: { type: Date, required: true },
});

const tokenSchema = new Schema({
  userid: { type: String, required: true, ref: "User" },
  token: { type: String, required: true, unique: true },
  expiry: { type: String },
});

const cartSchema = new Schema({
  cart_id: { type: String, required: true, unique: true },
  userid: { type: String, required: true, ref: "User" },
  pid: { type: String, required: true, ref: "Product" },
  quantity: { type: Number, default: 1, required: true },
  date_created: { type: Date, required: true },
});
cartSchema.index({ userid: 1 });

const orderSchema = new Schema({
  order_id: { type: String, required: true, unique: true },
  customer_id: { type: String, required: true, ref: "User" },
  total: { type: Types.Decimal128, required: true },
  billing_address_id: { type: String, required: true },
  order_status: { type: String },
  payment_type: { type: String, required: true },
  date_created: { type: Date, required: true },
});
orderSchema.index({ order_id: 1 });
orderSchema.index({ customer_id: 1 });

const orderItemSchema = new Schema({
  order_item_id: { type: String, required: true, unique: true },
  order_id: { type: String, required: true, ref: "Order" },
  item_id: { type: String, required: true, ref: "Product" },
  item_quantity: { type: Number, required: true },
});
orderItemSchema.index({ order_item_id: 1 });
orderItemSchema.index({ item_id: 1 });

const User = model("User", userSchema);
const UserAddress = model("UserAddress", userAddressSchema);
const UserPayment = model("UserPayment", userPaymentSchema);
const Product = model("Product", productSchema);
const Inventory = model("Inventory", inventorySchema);
const ProductCategory = model(
  "ProductCategory",
  productCategorySchema
);
const Discount = model("Discount", discountSchema);
const ProductRating = model("ProductRating", productRatingSchema);
const Rating = model("Rating", ratingSchema);
const Token = model("Token", tokenSchema);
const Cart = model("Cart", cartSchema);
const Order = model("Order", orderSchema);
const OrderItem = model("OrderItem", orderItemSchema);

export default {
  User,
  UserAddress,
  UserPayment,
  Product,
  Inventory,
  ProductCategory,
  Discount,
  ProductRating,
  Rating,
  Token,
  Cart,
  Order,
  OrderItem,
};
