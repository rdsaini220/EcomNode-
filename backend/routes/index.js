import express from 'express';
import { productController } from '../controllers';
import { catchAsyncErrors } from "../middlewares";
const router = express.Router();

router.get('/products', catchAsyncErrors(productController.getAll))
router.post('/products', catchAsyncErrors(productController.addNew))
router.put('/products', catchAsyncErrors(productController.updateData))
router.delete('/products/:id', catchAsyncErrors(productController.deleteData))

export default router;