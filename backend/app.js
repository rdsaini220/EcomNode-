import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import FileUpload from "express-fileupload";
const app = express();

import routes from './routes';
import { errorHandler } from "./middlewares";

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(FileUpload())

// Routes config
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next();
})
app.use('/api/v1', routes)

// error handle
app.use(errorHandler);

export default app;