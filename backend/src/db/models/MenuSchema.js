import { Schema } from 'mongoose';

const menuSchema = new Schema({
    products: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    extraIngredients: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    extras: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    recommended: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
});

export default menuSchema;