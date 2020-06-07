import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

const addressSchema = new Schema({
    city: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    houseOrFlatNumber: {
        type: String,
        required: true
    },
    flatCode: {
        type: String,
        required: false
    },
    isDefault: {
        type: Boolean,
        required: true,
        default: true
    }
});

const userSchema = new Schema({
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
    }, 
    addresses: {
        type: [addressSchema],
        required: false
    }
});

const legalProviders = ['CREDENTIALS', 'GOOGLE', 'FACEBOOK'];
userSchema.path('provider').validate(provider => legalProviders.some(
    legalProvider => legalProvider === provider), 'invalid provider');

const legalRoles = ['USER', 'OWNER', 'ADMIN'];
userSchema.path('role').validate(role => legalRoles.some(
    legalRole => legalRole === role), 'invalid role');

userSchema.methods.toIdentityJson = function ()  {
    return {
        id: this._id,
        provider: this.provider,
        providerKey: this.providerKey,
        role: this.role
    };
};

userSchema.methods.toProfileInfoJson = function () {
    return {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role
    };
}

userSchema.pre('save', function (next) {
    if (this.provider === 'CREDENTIALS' && !this.password)
        this.invalidate('password', 'CREDENTIALS provider requires password');
    next();
});

const User = mongoose.model('user', userSchema);

export default User;