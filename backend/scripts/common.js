import User from '../src/db/models/User';
import { parseIsoDatetime, parseObjectId } from '../src/common/utils';

export const credentialsUser = new User({
    _id : parseObjectId("5edb974ae989fe0233637691"),
    role : "USER",
    createdAt : parseIsoDatetime('2020-01-01T00:00:00.000Z').toDate(),
    provider : "CREDENTIALS",
    providerKey : "credentialsUser@mail.com",
    email : "credentialsUser@mail.com",
    password : "$2a$10$XLt3J9dVtPetUG4bcpZjMu4ldMA4yPi9Cfq05R3gK0A15NJ7m1qcy",
    firstName : "credentials",
    lastName : "user",
});

export const googleUser = new User({
    _id: parseObjectId("5edb9259e989fe023363768d"),
    role: "USER",
    createdAt: parseIsoDatetime('2020-01-01T00:00:00.000Z').toDate(),
    provider: "GOOGLE",
    providerKey: "117438012251231145401",
    firstName: "google",
    lastName: "user",
    email: "googleUser@mail.com",
});

export const facebookUser = new User({
    _id : parseObjectId("5edbd6b04e2bd13f1e382b0a"),
    role : "USER",
    createdAt : parseIsoDatetime('2020-01-01T00:00:00.000Z').toDate(),
    provider : "FACEBOOK",
    providerKey : "1055120123193998",
    firstName : "facebook",
    lastName : "user",
    email : "facebookUser@mail.com",
});

export const admin = new User({
    _id : parseObjectId("5edc03860d7cf173b85e7781"),
    role : "ADMIN",
    createdAt : parseIsoDatetime('2020-01-01T00:00:00.000Z').toDate(),
    provider : "CREDENTIALS",
    providerKey : "admin@mail.com",
    email : "admin@mail.com",
    password : "$2a$10$XLt3J9dVtPetUG4bcpZjMu4ldMA4yPi9Cfq05R3gK0A15NJ7m1qcy",
    firstName : "admin",
    lastName : "admin",
});

export const owner = new User({
    _id : parseObjectId("5edc03a1d412b03bf5d9d111"),
    role : "OWNER",
    createdAt : parseIsoDatetime('2020-01-01T00:00:00.000Z').toDate(),
    provider : "CREDENTIALS",
    providerKey : "ownner@mail.com",
    email : "ownner@mail.com",
    password : "$2a$10$XLt3J9dVtPetUG4bcpZjMu4ldMA4yPi9Cfq05R3gK0A15NJ7m1qcy",
    firstName : "ownner",
    lastName : "ownner",
});