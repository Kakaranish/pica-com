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
        required: true,
        default: 0
    },
    minFreeDeliveryPrice: {
        type: Number,
        set: v => v ? v.toFixed(2) : undefined,
        required: false
    },
    categories: [{
        type: [Schema.Types.ObjectId],
        ref: 'category',
        required: true,
        default: []
    }],
    status: {
        type: String,
        required: true,
        default: 'DRAFT'
    },
    statusEventId: {
        type: Schema.Types.ObjectId,
        required: false
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

const legalStatuses = ['DRAFT', 'PENDING', "ACCEPTED", "REJECTED", "CANCELLED"];
restaurantSchema.path('status').validate(status => legalStatuses.some(
    legalStatus => legalStatus === status), 'invalid status');

const Restaurant = mongoose.model('restaurant', restaurantSchema);

restaurantSchema.virtual('owner', {
    ref: 'user',
    localField: 'ownerId',
    foreignField: '_id',
    justOne: true
});

export default Restaurant;