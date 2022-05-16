import { User } from "../models";
import { CustomErrorHandler } from "../services";
import { sendToken } from "../utils";

const userController = {
    // Create User    
    async addUser(req, res, next) {
        const { name, email, password } = req.body;
        // save user data in database 
        const data = await User.create({
            name,
            email,
            password,
            image:{}
        })
        // send respons        
        sendToken(data, 201, res)
    },

    // get user details 
    async getUser(req, res) {
        const data = await User.findById(req.user.id)
        // send respons        
        res.status(200).json({ success: true, data });
    },

    // update user details 
    async updateUser(req, res) {
        let { name, email } = req.body;
        const data = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true, runValidators: true, useFindAndModify: false });

        // send respons        
        sendToken(data, 200, res);
    },

    // update password 
    async updatePassword(req, res) {
        let { oldPassword, password, confirmPassword } = req.body;
        const data = await User.findById(req.user.id).select("+password");
        const isPasswordMatch = await data.comparePassword(oldPassword);
        if (!isPasswordMatch) {
            return next(new CustomErrorHandler("Old Password is Invalid", 400));
        }
        if (password !== confirmPassword) {
            return next(new CustomErrorHandler("Password does not match", 400));
        }
        data.password = password;
        await data.save();
        // send respons        
        sendToken(data, 200, res);
    },

    // Get All Users (admin)
    async getAllUsers(req, res) {
        const data = await User.find()

        // send respons        
        res.status(200).json({ success: true, data });
    },

    // Get User info (admin)
    async getUserInfo(req, res, next) {
        const data = await User.findById(req.params.id)
        if (!data) {
            return next(new CustomErrorHandler(`User does not exist with Id ${req.params.id}`, 404));
        }
        // send respons        
        res.status(200).json({ success: true, data });
    },

    // update user details (admin) 
    async updateUserInfo(req, res) {
        let { name, email, role } = req.body;
        const data = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true, runValidators: true, useFindAndModify: false });

        // send respons        
        res.status(200).json({ success: true, data });
    },

    // delete user (admin) 
    async deleteUser(req, res) {
        const data = await User.findById(req.params.id)
        if (!data) {
            return next(new CustomErrorHandler(`User does not exist with Id ${req.params.id}`, 404));
        }
        await data.remove()

        // send respons        
        res.status(200).json({ success: true, messages: "User Deleted Successfully" });
    }
}


export default userController;