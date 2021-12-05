import jwt from 'jsonwebtoken';
import { CustomErrorHandler } from '../services';
import catchAsyncErrors from './catchAsyncErrors';
import { User } from '../models';

const isAuthenthicate = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next(new CustomErrorHandler("Please Login to access this resource", 401));
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodeData.id);
    next()
})

export default isAuthenthicate;