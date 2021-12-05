import express from "express";
import cookieParser from "cookie-parser";
const app = express();

import routes from './routes';
import { errorHandler } from "./middlewares";

app.use(express.json())
app.use(cookieParser())

// Routes config
app.use('/api/v1', routes)

// error handle
app.use(errorHandler);

export default app;