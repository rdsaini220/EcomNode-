import { CustomErrorHandler } from '../services';

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;

    let data = {
        message: 'Internal Server error',
        ...(process.env.DEBUG_MODE === 'true' && { originalError: err.message })
    }

    if(err.name === "CastError"){
        statusCode = 400,
        data = {
            message: `Resource not found. Invalid ${err.path}`
        }
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json(data);

}


export default errorHandler;