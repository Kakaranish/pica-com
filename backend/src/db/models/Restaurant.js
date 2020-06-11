import mongoose, { Schema } from 'mongoose';
import LocationSchema from './schemas/LocationSchema';
import menuSchema from './schemas/MenuSchema';
import ImageSchema from './schemas/ImageSchema';

const restaurantSchema = new Schema({
    ownerId: {
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
    location: {
        type: LocationSchema,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    images: {
        type: [ImageSchema],
        required: true,
        default: []
    },
    deliveryPrice: {
        type: Number,
        set: v => v.toFixed(2),
        required: false
    },
    minFreeDeliveryPrice: {
        type: Number,
        set: v => v.toFixed(2),
        required: false
    },
    categoryCodes: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'DRAFT'
    },
    menu: {
        type: menuSchema,
        required: true,
        default: {}
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const legalStatuses = ['DRAFT', 'PENDING', 'REJECTED', 'PUBLIC', 'PRIVATE'];
restaurantSchema.path('status').validate(status => legalStatuses.some(
    legalStatus => legalStatus === status), 'invalid status');

const Restaurant = mongoose.model('restaurant', restaurantSchema);

export default Restaurant;