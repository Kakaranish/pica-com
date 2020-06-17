import { Schema } from 'mongoose';
import '../Pizza';
import ExtraIngredientOrderSchema from './ExtraIngredientOrderSchema';

const PizzaOrderSchema = new Schema({
    pizza: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'pizza'
    },
    extraIngredients: {
        type: [ExtraIngredientOrderSchema],
        required: true,
        default: []
    },
    quantity: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i',
        required: true
    },
    pricePerPizza: {
        type: Number,
        set: v => v.toFixed(2),
        required: true
    }
});

export default PizzaOrderSchema;