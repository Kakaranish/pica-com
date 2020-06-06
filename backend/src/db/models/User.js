import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

const schema = new Schema({
    provider: {
        type: String,
        required: true
    },
    providerKey: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'USER',
        required: true
    },
    createdAt: {
        type: Date,
        default: moment.utc().toDate(),
        required: true
    }
});

const legalProviders = ['CREDENTIALS', 'GOOGLE', 'FACEBOOK'];
schema.path('provider').validate(provider => legalProviders.some(
    legalProvider => legalProvider === provider), 'invalid provider');

const legalRoles = ['USER', 'OWNER', 'ADMIN'];
schema.path('role').validate(role => legalRoles.some(
    legalRole => legalRole === role), 'invalid role');

schema.methods.toIdentityJson = function ()  {
    return {
        id: this._id,
        provider: this.provider,
        providerKey: this.providerKey,
        role: this.role
    };
}

schema.pre('save', function (next) {
    if (this.provider === 'CREDENTIALS' && !this.password)
        this.invalidate('password', 'CREDENTIALS provider requires password');
    next();
});

const User = mongoose.model('user', schema);

export default User;