import { Schema } from 'mongoose';

const ExtraIngredientOrderSchema = new Schema({
    extraIngredient: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'extra'
    },
    pricePerExtra: {
        type: Number,
        set: v => v.toFixed(2),
        required: true
    }
});

export default ExtraIngredientOrderSchema;