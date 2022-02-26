import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 8 characters"],
        minLength: [4, "Name should have more than 4 characters"]
    },
    email: { 
        type: String, 
        required: [true, "Please Enter Your email"],
        unique:true,
        validate:[validator.isEmail, 'Please Enter a valid Email']
    },
    password: {
        type: String,
        minLength: [8, "Name should have more than 4 characters"],
        select:false
    },
    image:{
        public_id: {
            type: String
        },
        url: {
            type: String
        },
    },
    role:{
        type: String,
        default:"user"
    },
    status: {
        type: Boolean,
        default: true
    },
    restPasswordToken:String,
    restPasswordExpire:Date,
}, { timestamps: true })

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// JWT token 
userSchema.methods.getJWTToken = function(){
    return jwt.sign({ id: this._id, role: this.role}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Compare Password 
userSchema.methods.comparePassword = async function (pw) {
    return await bcrypt.compare(pw, this.password)
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex")
    // Hashing and adding resetPasswordToken to user schema
    this.restPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.restPasswordExpire = Date.now() + 15 * 60 * 1000
    return resetToken;
}

export default mongoose.model('User', userSchema)