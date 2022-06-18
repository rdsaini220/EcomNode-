import express from 'express';
import { authController, userController, productController, reviewController, orderController, paymentController,  } from '../controllers';
import { catchAsyncErrors, isAuth, authorizeRoles } from "../middlewares";
const router = express.Router();

//Auth Routes
router.post('/register', catchAsyncErrors(authController.register))
router.post('/login', catchAsyncErrors(authController.login))
router.get('/refresh-token', isAuth, catchAsyncErrors(authController.refreshToken))
router.get('/logout', isAuth, catchAsyncErrors(authController.logout))
router.post('/password/forgot', catchAsyncErrors(authController.forgotPassword))
router.put('/password/reset/:token', catchAsyncErrors(authController.resetPassword))

//User Routes
router.get('/user/me', isAuth, catchAsyncErrors(userController.getUser))
router.put('/user/me', isAuth, catchAsyncErrors(userController.updateUser))
router.put('/password', isAuth, catchAsyncErrors(userController.updatePassword))
// Admin control user routes
router.get('/admin/users', isAuth, authorizeRoles('admin'), catchAsyncErrors(userController.getAllUsers))
router.get('/admin/user/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(userController.getUserInfo))
router.put('/admin/user/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(userController.updateUserInfo))
router.delete('/admin/user/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(userController.deleteUser))

//Product Routes
router.get('/products', catchAsyncErrors(productController.getAll))
router.get('/product/:slug', catchAsyncErrors(productController.getSingle))
// Admin control product routes
router.post('/product', isAuth, authorizeRoles('admin'), catchAsyncErrors(productController.addNew))
router.put('/product', isAuth, authorizeRoles('admin'), catchAsyncErrors(productController.updateData))
router.delete('/product/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(productController.deleteData))

//common routes
router.put('/review', isAuth, catchAsyncErrors(reviewController.addNew))
router.delete('/review', isAuth, catchAsyncErrors(reviewController.deleteData))

//Order Routes
router.post('/order', isAuth, catchAsyncErrors(orderController.addNew))
router.get('/orders', isAuth, catchAsyncErrors(orderController.myOrder))

//Payment routes
router.post('/payment/process', isAuth, catchAsyncErrors(paymentController.processPayment))
router.get('/stripeapikey', isAuth, catchAsyncErrors(paymentController.sendStripeApiKey))

//Admin control order routes
router.get('/admin/orders', isAuth, authorizeRoles('admin'), catchAsyncErrors(orderController.getAll))
router.get('/admin/order/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(orderController.getSingle))
router.put('/admin/order/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(orderController.updateOrder))
router.delete('/admin/order/:id', isAuth, authorizeRoles('admin'), catchAsyncErrors(orderController.deleteOrder))


export default router;