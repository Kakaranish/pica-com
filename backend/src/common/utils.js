import moment from 'moment';
import mongoose from 'mongoose';
import 'regenerator-runtime';

/**
 * @param {String} datetime 
 * @returns {moment.Moment}
 */
export const parseIsoDatetime = datetime => {
    const isoDatetime = moment.utc(datetime, moment.ISO_8601, true)
    return isoDatetime.isValid()
        ? isoDatetime
        : null;
};

/**
 * 
 * @param {String} objectId 
 * @returns {mongoose.}
 */
export const parseObjectId = objectId => {
    return mongoose.Types.ObjectId.isValid(objectId)
        ? mongoose.Types.ObjectId(objectId)
        : null;
};

/**
 * @async
 * @param {Response} res 
 * @param {Function} action 
 */
export const withAsyncRequestHandler = async (res, action) => {
    try {
        await action();
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({ errors: ['Internal error'] });
    }
};

export const calculateItemsTotalPrice = (pizzaItems, extraItems) => {
    let totalPrice = 0;
    pizzaItems.forEach(pizzaItem => {
        const extraIngrsPrice = pizzaItem.extraIngredients.map(extraIngr =>
            extraIngr.pricePerExtra).reduce((l, r) => l + r, 0);
        totalPrice += pizzaItem.quantity * (pizzaItem.pricePerPizza +
            extraIngrsPrice);
    });
    extraItems.forEach(extraItem => totalPrice += extraItem.pricePerExtra);
    return totalPrice;
};

/**
 * @param {String} text 
 */
export const normalizeText = text => {
    let normalizedText = text.toLowerCase();
    normalizedText = replaceAll(normalizedText, 'ó', 'o');
    normalizedText = replaceAll(normalizedText, 'ą', 'a');
    normalizedText = replaceAll(normalizedText, 'ź', 'z');
    normalizedText = replaceAll(normalizedText, 'ż', 'z');
    normalizedText = replaceAll(normalizedText, 'ę', 'e');
    normalizedText = replaceAll(normalizedText, 'ś', 's');
    normalizedText = replaceAll(normalizedText, 'ł', 'l');
    normalizedText = replaceAll(normalizedText, 'ć', 'c');
    normalizedText = replaceAll(normalizedText, 'ń', 'n');
    normalizedText = normalizedText.trim();
    return normalizedText;
};

function replaceAll (string, search, replace) {
    return string.split(search).join(replace);
}
