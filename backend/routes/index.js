import express from 'express';
import { productController, userController, reviewController, orderController } from '../controllers';
import { catchAsyncErrors, isAuth, authorizeRoles } from "../middlewares";
const router = express.Router();
//common routes
router.get('/products', catchAsyncErrors(productController.getAll))
router.get('/product/:slug', catchAsyncErrors(productController.getSingle))
router.put('/review', isAuth, catchAsyncErrors(reviewController.addNew))
router.delete('/review', isAuth, catchAsyncErrors(reviewController.deleteData))

//user routes
router.post('/register', catchAsyncErrors(userController.addUser))
router.post('/login', catchAsyncErrors(userController.loginUser))
router.post('/password/forgot', catchAsyncErrors(userController.forgotPassword))
router.put('/password/reset/:token', catchAsyncErrors(userController.resetPassword))
router.get('/logout', catchAsyncErrors(userController.logoutUser))
router.get('/me', isAuth, catchAsyncErrors(userController.getUser))
router.put('/me', isAuth, catchAsyncErrors(userController.updateUser))
router.put('/password', isAuth, catchAsyncErrors(userController.updatePassword))

//order routes
router.post('/order', isAuth, catchAsyncErrors(orderController.addNew))
router.get('/orders', isAuth, catchAsyncErrors(orderController.myOrder))
router.get('/admin/orders', isAuth, authorizeRoles('admin'), catchAsyncErrors(orderController.getAll))
router.get('/admin/order/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(orderController.getSingle))
router.put('/admin/order/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(orderController.updateOrder))
router.delete('/admin/order/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(orderController.deleteOrder))

//admin routes
router.post('/product', isAuth, authorizeRoles('admin'), catchAsyncErrors(productController.addNew))
router.put('/product', isAuth, authorizeRoles('admin'), catchAsyncErrors(productController.updateData))
router.delete('/product/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(productController.deleteData))
router.get('/admin/users', isAuth, authorizeRoles('admin'), catchAsyncErrors(userController.getAllUsers))
router.get('/admin/user/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(userController.getUserInfo))
router.put('/admin/user/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(userController.updateUserInfo))
router.delete('/admin/user/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(userController.deleteUser))

export default router;