import { Product } from "../models";
import { CustomErrorHandler } from "../services";
import { ApiFeatures } from "../utils";

const productController = {
    // Create Product    
    async addNew(req, res, next){
        const { name } = req.body;
        // get by name product  
        const pro = await Product.findOne({ name });
        if(pro){
            return next(CustomErrorHandler.alreadyExist('Product Name is already exist...'));
        }
        // save user data in database 
        const product = new Product(req.body)
        const data = await product.save();

        res.json({ success: true, data });
    },
    
    async getAll(req, res) {
        // get data in database 
        const total = await Product.countDocuments();
        const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filters().pagination();
        // get data in database 
        const data = await apiFeatures.query;
        res.json({ success: true, total, data });
    },

    async updateData(req, res, next) {
        const { _id, name } = req.body;
        // get by id product 
        const product = await Product.findById(_id);
        console.log('product', product)
        if (!product) {
            return next(CustomErrorHandler.notFound());
        }
        // get by name product  
        const pro = await Product.findOne({ name });
        if (pro && product.name !== name) {
            return next(CustomErrorHandler.alreadyExist('Product Name is already exist...'));
        }
        // get by id product data updates
        const data = await Product.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.json({ success: true, data });
    },

    async deleteData(req, res, next) {
        const { _id, name } = req.body;
        // get by id product  
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(CustomErrorHandler.notFound());
        }
        // get by id product data updates
        const data = await product.remove()

        res.json({ success: true, message:"Product delete successfull",  data });
    },
}


export default productController;