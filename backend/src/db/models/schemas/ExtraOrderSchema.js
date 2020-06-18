import { Schema } from 'mongoose';

const ExtraOrderSchema = new Schema({
    extra: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'extra'
    },
    quantity: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i',
        required: true
    },
    pricePerExtra: {
        type: Number,
        set: v => v.toFixed(2),
        required: true
    }
});

export default ExtraOrderSchema;