import { CustomErrorHandler } from "../services";

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new CustomErrorHandler(`Role ${req.user.role} is not allowed this resouce!`, 403));
        }
        next()
    }
}

export default authorizeRoles;