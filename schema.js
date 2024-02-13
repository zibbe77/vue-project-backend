import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    favPokemon: [String],
    favPokemonId: [Number],
    favMove: [String],
    favMoveId: [Number],
});

export const User = mongoose.model("User", userSchema);
