import mongoose from "mongoose";
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const productSchema = mongoose.Schema({
    name: {
        unique: true,
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true
    },
    slug: {
        type: String,
        slug: "name",
        unique: true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        maxLength: [8, "Price cannot exceed 8 characters"],
        required: [true, "Please Enter Product Price"]
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    }],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"]
    },
    stock: {
        type: Number,
        maxLength: [4, "Stock cannot exceed 4 characters"],
        required: [true, "Please Enter Product Price"],
        default: 1
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    }],
    ratings: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true })

// productSchema.pre("save", function (next) {
//     this.slug = this.name.split(" ").join("-");
//     next();
// });
// productSchema.pre("update", function (next) {
//     this._update.$set['slug'] = this.name.split(" ").join("-")  
//     next();
// });
export default mongoose.model('Product', productSchema)