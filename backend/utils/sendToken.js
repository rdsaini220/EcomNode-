import { RefreshToken } from "../models";

const sendToken = async (user, statusCode, res, message) => {
    const token = user.getJWTToken()
    // opctions for cookies
    const opctions = {
        exprires: new Date(
            Date.now() + process.env.COOKIE_EXPRIE * 24 * 60 * 60 * 1000 
        )
    };
    await RefreshToken.create({ token })
    res.status(statusCode).cookie("token", token, opctions).json({
        success:true,
        message,
        token,
        data:{
            _id:user._id,
            role:user.role,
            name:user.name,
            email:user.email,
            image: user.image,
        },        
    })
}

export default sendToken;