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
    statusChangeAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    opinionId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    payment: {
        type: {
            method: {
                type: String,
                required: true
            },
            transactionId: {
                type: String,
                required: false
            }
        },
        required: false
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

orderSchema.pre('save', function () {
    const legalPaymentMethods = ['ON_DELIVERY', 'BLIK', 'PAYU'];
    if (!legalPaymentMethods.includes(this.payment.method))
        this.invalidate('payment.method', 'illegal value');
    if (this.payment.method !== 'ON_DELIVERY' && !this.payment.transactionId)
        this.invalidate('payment.transactionId',
            'field required when method is blik or payu');
    next();
});

orderSchema.pre('save', function () {
    const legalStatuses = ['INITIALIZED', 'IN_PREPARATION', 'IN_DELIVERY', 'COMPLETED'];
    if (!legalStatuses.includes(this.status))
        this.invalidate('status', 'illegal value');
    next();
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