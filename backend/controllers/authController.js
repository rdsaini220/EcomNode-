import crypto from "crypto";
import cloudinary from "cloudinary";

import { User, RefreshToken } from "../models";
import { CustomErrorHandler } from "../services";
import { sendToken, sendEmail } from "../utils";

const authController = {
    // Create User    
    async register(req, res, next) {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "profile",
            width: 150,
            crop: "scale",
        });
        const { name, email, password, image = {} } = req.body;
        // save user data in database 
        const data = await User.create({
            name,
            email,
            password,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        })
        // send respons        
        sendToken(data, 201, res)
    },

    // Login User 
    async login(req, res, next) {
        const { email, password } = req.body;
        // get data in database 
        if (!email || !password) {
            return next(new CustomErrorHandler("Please Enter Email & Password", 400));
        }
        let data = await User.findOne({ email }).select("+password");
        if (!data) {
            return next(new CustomErrorHandler("Invalid email or password", 401));
        }
        const isPasswordMatch = await data.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new CustomErrorHandler("Invalid email or password", 401));
        }
        if (data.status === false) {
            return next(new CustomErrorHandler("This account is blocked", 203));
        }
        // send respons        
        sendToken(data, 200, res)
    },

    // Logout User 
    async logout(req, res, next) {
        const token = req.headers.authorization;
        const data = await RefreshToken.findOne({ token })
        if (!data) {
            return next(new CustomErrorHandler(`User login does not exist with token ${token}`, 404));
        }
        await data.remove()
        res.status(200).json({ success: true, messages: "Logout Successfully" });
    },

    // Refresh User
    async refresh(req, res, next) {
        const token = req.headers.authorization;
        console.log(token)
        const data = await RefreshToken.findOne({ token })
        if (!data) {
            return next(new CustomErrorHandler(`User login does not exist with token ${token}`, 404));
        }
        // send respons     
        sendToken(data, 200, res)
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
        try {
            await sendEmail({
                email: data.email,
                subject: 'ecomNode Password Recovery',
                messages,
            })
            res.status(200).json({ success: true, messages: `Email sendto ${data.email} successfully` });
        } catch (err) {
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

        const data = await User.findOne({ restPasswordToken, restPasswordExpire: { $gt: Date.now() } })
        if (!data) {
            return next(new CustomErrorHandler("Reset Password Token is invalid or has been expired", 400));
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new CustomErrorHandler("Password does not password", 400));
        }

        data.password = req.body.password;
        data.restPasswordToken = undefined;
        data.restPasswordExpire = undefined;
        await data.save()

        // send respons        
        sendToken(data, 200, res)
    }
}


export default authController;