export const getFormDataJsonFromEvent = event => {
    const formData = new FormData(event.target);

    let formDataJson = {};
    for (const [key, value] of formData.entries()) {
        formDataJson[key] = value;
    }

    return formDataJson;
}

/**
 * @async
 * @param {function: any} action 
 * @param  {Array.<{status: string, function: void}>} handlers 
 * @returns {Promise.<any>} result
 * @example 
 * await requestHandler(
 *  async () => axios.post('/some/uri'/),
 *  {status: 404, callback: async () => console.log('custom 404 error handling')},
 *  {status: 500, callback: async () => {window.location = '/error/500'}},
 * );
 */
export const requestHandler = async (action, ...handlers) => {

    handlers = handlers ?? [];
    let handlersDict = Object.assign({}, ...handlers.map
        (h => ({ [h.status]: h.callback })));

    const result = await action();
    if (result.status === 200) {
        if (handlersDict[200]) return await handlersDict[200](result.data);
        else return result.data;
    }

    const anyStatus = -1;
    const callbackForAnyStatus = handlersDict[anyStatus];
    if (callbackForAnyStatus) return callbackForAnyStatus(result.data);

    const callback = handlersDict[result.status];
    if (callback) return await callback(result.data);

    document.location = `/error/${result.status}`;
};


function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

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

export const getStatusName = status => {
    switch (status) {
        case 'IN_PREPARATION':
            return 'In Preparation';
        case 'IN_DELIVERY':
            return 'In Delivery';
        case 'COMPLETED':
            return 'Completed';
        default:
            return null;
    }
};