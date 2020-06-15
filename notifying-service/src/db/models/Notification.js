import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    eventId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    header: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, {
    timestamps: { createdAt: 'createdAt' }
});

notificationSchema.methods.toNotifJson = function () {
    return {
        id: this._id,
        createdAt: this.createdAt,
        header: this.header,
        content: this.content
    };
};

const Notification = mongoose.model('notification', notificationSchema);

export default Notification;