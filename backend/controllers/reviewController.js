import { Product } from "../models";
import { CustomErrorHandler } from "../services";
import { ApiFeatures } from "../utils";

const reviewController = {
    // Create Product review   
    async addNew(req, res, next) {
        const { productID, name, rating, comment } = req.body;
        // get by id product 
        const product = await Product.findById(productID);
        if (!product) {
            return next(new CustomErrorHandler("Product not found", 404));
        }

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user.id.toString()) {
                    rev.rating = rating;
                    rev.comment = comment;
                }
            });
        } else {
            product.reviews.push({ name, rating, comment, user: req.user.id });
        }
        // get avrage rating 
        let avg = 0;
        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        product.ratings = avg / product.reviews.length;
        const data = await product.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, data });
    },

    async deleteData(req, res, next) {
        const { _id, name } = req.body;
        // get by id product  
        const product = await Product.findById(req.query.productId);
        if (!product) {
            return next(new CustomErrorHandler("Product not found", 404));
        }
        // id by reviews delete
        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() === req.query.id.toString()
        );
        // get avrage rating 
        let avg = 0;
        reviews.forEach((rev) => {
            avg += rev.rating;
        });
        const ratings = avg / reviews.length;
        const data = await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings }, { new: true, runValidators: true, useFindAndModify: false });

        res.status(200).json({ success: true, message: "Product delete successfull", data });
    },
}


export default reviewController;