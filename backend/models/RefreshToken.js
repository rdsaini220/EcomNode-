import mongoose from "mongoose";

const refreshTokenSchema = mongoose.Schema({
    token: { type: String, unique: true }
}, { timestamps: true });


export default mongoose.model('RefreshToken', refreshTokenSchema)