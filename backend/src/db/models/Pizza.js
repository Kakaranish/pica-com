import mongoose, { Schema } from 'mongoose';

const pizzaSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        set: v => v.toFixed(2),
        required: true
    },
    diameter: {
        type: Number,
        set: v => v.toFixed(0),
        required: true
    },
    picUrl: {
        type: String,
        required: false
    },
});

const Pizza = mongoose.model('pizza', pizzaSchema);

export default Pizza;