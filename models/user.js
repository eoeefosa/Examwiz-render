import mongoose, { Schema, Document } from "mongoose";

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    phone_no: String,
    address: String,
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bonusPoints: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    plan: { type: String, default: "Lite" },
    plan_updatedate: { type: Date },
    plan_expiringdate: { type: Date },
    user_role: String,
    img_url: String,
    img_id: String,
    posts: [String],
    post_count: { type: Number, default: 0 },
    follower: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    points: { type: Number, default: 0 },
    timeStamp: Number,
    createdAt: { type: Date, default: Date.now() },
    lastSeen: { type: Date, default: Date.now() },
    is_online: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { collection: "users" }
);

export default mongoose.model("Users", userSchema);
