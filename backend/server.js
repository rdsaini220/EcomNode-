import dotenv from "dotenv";
import cloudinary from "cloudinary";

import app from "./app";
import dbConnect from "./config/database";

// Handling Uncaught Exception
process.on('uncaughtException', err => {
    console.log(`Error:  ${err.message}`)
    console.log("Shutting down the server due to Handling Uncaught Exception")
    process.exit(1)
})
// config
dotenv.config({path:"backend/.env"})

// database connect
dbConnect()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT, ()=> {
    console.log(`Listing on a port ${process.env.PORT}.`);
})

// Unhandled promise Rejections
process.on('unhandledRejection', err => {
    console.log(`Error:  ${err.message}`)
    console.log("Shutting down the server due to Unhandled promise Rejection")
    server.close(() => {
        process.exit()
    })
})