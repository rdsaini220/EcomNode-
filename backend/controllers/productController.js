import { Product } from "../models";
import { CustomErrorHandler } from "../services";
import { ApiFeatures } from "../utils";

const productController = {
    // Create Product    
    async addNew(req, res, next) {
        req.body.createdBy = req.user.id

        // save user data in database 
        const product = new Product(req.body)
        const data = await product.save();

        res.status(200).json({ success: true, data });
    },

    async getAll(req, res) {
        const per_page = 2;
        const total_product = await Product.countDocuments();
        const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filters().pagination(per_page);
        // get data in database 
        const data = await apiFeatures.query;
        let filtered_products_total = data.length;
        res.status(200).json({ success: true, data, total_product, per_page, filtered_products_total });
    },

    // get single product
    async getSingle(req, res, next) {
        const data = await Product.findOne({ slug: req.params.slug });
        if (!data) {
            return next(new CustomErrorHandler("Product not found with this Slug", 404));
        }
        res.status(200).json({ success: true, data });
    },

    async updateData(req, res, next) {
        req.body.updatedBy = req.user.id
        const { _id, name } = req.body;
        // get by id product 
        const product = await Product.findById(_id);
        if (!product) {
            return next(new CustomErrorHandler("Product not found", 404));
        }
        // get by id product data updates
        const data = await Product.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({ success: true, data });
    },

    async deleteData(req, res, next) {
        const { _id, name } = req.body;
        // get by id product  
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new CustomErrorHandler("Product not found", 404));
        }
        // get by id product data updates
        const data = await product.remove()

        res.status(200).json({ success: true, message: "Product delete successfull", data });
    },
}


export default productController;