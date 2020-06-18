import { Schema } from 'mongoose';
import '../Extra';

const MenuSchema = new Schema({
    pizzas: [{
        type: Schema.Types.ObjectId,
        ref: 'pizza',
        required: true,
        default: []
    }],
    extraIngredients: [{
        type: [Schema.Types.ObjectId],
        ref: 'extra',
        required: true,
        default: []
    }],
    extras: [{
        type: [Schema.Types.ObjectId],
        ref: 'extra',
        required: true,
        default: []
    }],
    recommended: [{
        type: [Schema.Types.ObjectId],
        ref: 'pizza',
        required: true,
        default: []
    }]
});

export default MenuSchema;