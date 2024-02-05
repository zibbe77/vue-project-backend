import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: Number, require: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

export const User = mongoose.model("User", userSchema);
