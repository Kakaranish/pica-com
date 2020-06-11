import mongoose, { Schema } from 'mongoose';

const pizzaSchema = new Schema({
    restaurantId: {
        type: Schema.Types.ObjectId,
        required: true
    },
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
    }
});

const Pizza = mongoose.model('pizza', pizzaSchema);

pizzaSchema.virtual('restaurant', {
    ref: 'restaurant',
    localField: 'restaurantId',
    foreignField: '_id',
    justOne: true
});

export default Pizza;