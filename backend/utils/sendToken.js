const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken()
    // opctions for cookies
    const opctions = {
        exprires: new Date(
            Date.now() + process.env.COOKIE_EXPRIE * 24 * 60 * 60 * 1000 
        )
    };
    res.status(statusCode).cookie("token", token, opctions).json({
        success:true,
        token,
        data:{
            _id:user._id,
            name:user.name,
            email:user.email,
            image: user.image,
        },        
    })
}

export default sendToken;