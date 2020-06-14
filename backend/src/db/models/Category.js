import mongoose from 'mongoose';

const categorySchema = {
    name: {
        type: String,
        required: true,
        unqiue: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
};

const Category = mongoose.model('category', categorySchema);

export default Category;