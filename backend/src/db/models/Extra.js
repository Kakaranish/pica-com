import mongoose, { Schema } from 'mongoose';

const extraSchema = new Schema({
    restaurantId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        set: v => v.toFixed(2),
        required: true
    }
});

const Extra = mongoose.model('extra', extraSchema);

extraSchema.virtual('restaurant', {
    ref: 'restaurant',
    localField: 'restaurantId',
    foreignField: '_id',
    justOne: true
});

export default Extra;