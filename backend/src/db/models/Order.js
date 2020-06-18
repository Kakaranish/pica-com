import mongoose, { Schema } from 'mongoose';
import PizzaOrderSchema from './schemas/PizzaOrderSchema';
import ExtraOrderSchema from './schemas/ExtraOrderSchema';
import AddressSchema from './schemas/AddressSchema';

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    pizzas: {
        type: [PizzaOrderSchema],
        required: true,
        default: []
    },
    extras: {
        type: [ExtraOrderSchema],
        required: true,
        default: []
    },
    deliveryPrice: {
        type: Number,
        set: v => v.toFixed(2),
        required: true
    },
    deliveryAddress: {
        type: AddressSchema,
        required: false
    },
    status: {
        type: String,
        required: true,
        default: 'INITIALIZED'
    },
    opinionId: {
        type: Schema.Types.ObjectId,
        required: false
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Order = mongoose.model('order', orderSchema);

orderSchema.virtual('user', {
    ref: 'user',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

orderSchema.virtual('restaurant', {
    ref: 'restaurant',
    localField: 'restaurantId',
    foreignField: '_id',
    justOne: true
});

export default Order;