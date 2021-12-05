import express from 'express';
import { productController, userController } from '../controllers';
import { catchAsyncErrors, isAuth, authorizeRoles } from "../middlewares";
const router = express.Router();

router.get('/products', catchAsyncErrors(productController.getAll))
router.post('/products', isAuth, authorizeRoles('admin'), catchAsyncErrors(productController.addNew))
router.put('/products', isAuth, authorizeRoles('admin'), catchAsyncErrors(productController.updateData))
router.delete('/products/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(productController.deleteData))

router.post('/register', catchAsyncErrors(userController.addUser))
router.post('/login', catchAsyncErrors(userController.loginUser))
router.post('/password/forgot', catchAsyncErrors(userController.forgotPassword))
router.put('/password/reset/:token', catchAsyncErrors(userController.resetPassword))
router.get('/logout', catchAsyncErrors(userController.logoutUser))
export default router;