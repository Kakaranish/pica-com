import mongoose, { Schema } from 'mongoose';

const extraSchema = new Schema({
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

export default Extra;