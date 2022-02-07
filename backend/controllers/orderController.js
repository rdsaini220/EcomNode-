import { Product, Order } from "../models";
import { CustomErrorHandler } from "../services";

const orderController = {
    // Create Order    
    async addNew(req, res, next) {
        req.body.paidAt = Date.now();
        req.body.user = req.user.id;

        // save user data in database 
        const order = new Order(req.body)
        const data = await order.save();

        res.status(200).json({ success: true, data });
    },

    // get login user all orders
    async myOrder(req, res, next) {
        const data = await Order.find({ user: req.user.id })
        res.status(200).json({ success: true, data });
    },

    // get all orders (admin)
    async getAll(req, res) {
        const data = await Order.find()
        let totalAmount = 0;
        data.forEach((order) => {
            totalAmount += order.totalPrice;
        })

        // send respons        
        res.status(200).json({ success: true, totalAmount, data });
    },

    // get single order Info (admin)
    async getSingle(req, res, next) {
        const data = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );
        if (!data) {
            return next(new CustomErrorHandler("Order not found with this Id", 404));
        }
        res.status(200).json({ success: true, data });
    },

    // update order status (Admin)
    async updateOrder(req, res, next) {
        // let { orderStatus } = req.body.orderStatus;
        let data = await Order.findById(req.params.id)  

        if (!data) {
            return next(new CustomErrorHandler("Order not found with this Id", 404));
        }
        data.orderItem.forEach(async (order) => {
            const proData = await Product.findById(order.productId);
            if (proData.stock < 1){
                return next(new CustomErrorHandler("This Product Out-of-Stock", 400));
            }
        })
        if (data.orderStatus === 'delivered' && req.body.orderStatus !== "shipped") {
            return next(new CustomErrorHandler("You have already delivered this order", 400));
        }
        if (data.orderStatus === 'shipped' && req.body.orderStatus === "shipped") {
            return next(new CustomErrorHandler("You have already shipped this order", 400));
        }
        if (req.body.orderStatus === "shipped") {
            data.orderItem.forEach(async(order) => {
                const proData = await Product.findById(order.productId);
                proData.stock -= order.quantity;
                await proData.save({ validateBeforeSave: false })
            })
        }
        data.orderStatus = req.body.orderStatus;        
        if (req.body.orderStatus == 'delivered') {
            data.deliveredAt = Date.now();
        }
        await data.save({ validateBeforeSave: false })
        res.status(200).json({ success: true, data });
    },

    // delete order (Admin)
    async deleteOrder(req, res, next) {
        const data = await Order.findById(req.params.id)
        if (!data) {
            return next(new CustomErrorHandler("Order not found with this Id", 404));
        }
        await data.remove()
        res.status(200).json({ success: true, message: "Order delete successfull", data });
    },
}


export default orderController;