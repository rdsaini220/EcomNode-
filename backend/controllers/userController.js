import crypto from "crypto";

import { User } from "../models";
import { CustomErrorHandler } from "../services";
import { sendToken, sendEmail } from "../utils";

const userController = {
    // Create User    
    async addUser(req, res, next){
        const { name, email, password, image={} } = req.body;
        // get by name product  
        const result = await User.findOne({ email });
        // save user data in database 
        const data = await User.create({
            name, email, password, image
        })
        // send respons        
        sendToken(data, 201,res)
    },
    
    // Login User 
    async loginUser(req, res, next) {
        const { email, password } = req.body;
        // get data in database 
        if(!email || !password){
            return next(new CustomErrorHandler("Please Enter Email & Password", 400));
        }
        const data = await User.findOne({ email }).select("+password");
        if (!data) {
            return next(new CustomErrorHandler("Invalid email or password", 401));
        }
        const isPasswordMatch = await data.comparePassword(password);
        console.log(isPasswordMatch)
        if (!isPasswordMatch) {
            return next(new CustomErrorHandler("Invalid email or password", 401));
        }

        // send respons        
        sendToken(data, 200, res)
    },

    // Logout User 
    async logoutUser(req, res, next) {
        res.cookie('token', null, {
            expires: new Date(),
            httpOnly:true,  
        })
        res.status(200).json({ success: true, messages: "Logout Successfully" });
    },

    // Forgot Password  
    async forgotPassword(req, res, next) {
        const data = await User.findOne({ email: req.body.email });
        if (!data) {
            return next(new CustomErrorHandler("User not found", 404));
        }
        // Get Reset Password token
        const resetToken = data.getResetPasswordToken();
        await data.save({ validateBeforeSave: false })
        const restPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/rest/${resetToken}`;
        const messages = `Your password rest token is :- \n\n ${restPasswordUrl} \n\n if you have not requested this email then, please ignore it`;
        try{
            await sendEmail({
                email:data.email,
                subject: 'ecomNode Password Recovery',
                messages,
            })
            res.status(200).json({ success: true, messages: `Email sendto ${data.email} successfully` });
        }catch(err){
            data.restPasswordToken = undefined
            data.restPasswordExpire = undefined
            await data.save({ validateBeforeSave: false })
            return next(new CustomErrorHandler(err.message, 500));
        }
    },

    // Reset Password 
    async resetPassword(req, res, next) {
        // Hash resetPasswordToken to find user schema
        const restPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

        const data = await User.findOne({ restPasswordToken, restPasswordExpire: { $gt : Date.now() }  })
        if (!data) {
            return next(new CustomErrorHandler("Reset Password Token is invalid or has been expired", 400));
        }

        if(req.body.password !== req.body.confirmPassword){
            return next(new CustomErrorHandler("Password does not password", 400));
        }

        data.password = req.body.password;
        data.restPasswordToken = undefined;
        data.restPasswordExpire = undefined;
        await data.save()

        // send respons        
        sendToken(data, 200, res)
    },
}


export default userController;