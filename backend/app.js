import express from "express";
const app = express();

import routes from './routes';
import { errorHandler } from "./middlewares";

app.use(express.json())

// Routes config
app.use('/api/v1', routes)

// error handle
app.use(errorHandler);

export default app;