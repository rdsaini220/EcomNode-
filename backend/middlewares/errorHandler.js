import { CustomErrorHandler } from '../services';

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = process.env.DEBUG_MODE === 'true' && err.message && err.message|| "Internal Server Error";

    // Wrong Mongodb Id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new CustomErrorHandler(message, 400);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `${Object.keys(err.keyValue)} is already exist...`;
        err = new CustomErrorHandler(message, 400);
    }

    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again `;
        err = new CustomErrorHandler(message, 400);
    }

    // JWT EXPIRE error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again `;
        err = new CustomErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });

}


export default errorHandler;