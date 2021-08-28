"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventbriteApiRequestAllItems = exports.eventbriteApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
async function eventbriteApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    let options = {
        headers: {},
        method,
        qs,
        body,
        uri: uri || `https://www.eventbriteapi.com/v3${resource}`,
        json: true,
    };
    options = Object.assign({}, options, option);
    if (Object.keys(options.body).length === 0) {
        delete options.body;
    }
    const authenticationMethod = this.getNodeParameter('authentication', 0);
    try {
        if (authenticationMethod === 'privateKey') {
            const credentials = await this.getCredentials('eventbriteApi');
            if (credentials === undefined) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
            }
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
            return await this.helpers.request(options);
        }
        else {
            return await this.helpers.requestOAuth2.call(this, 'eventbriteOAuth2Api', options);
        }
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
exports.eventbriteApiRequest = eventbriteApiRequest;
async function eventbriteApiRequestAllItems(propertyName, method, resource, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    do {
        responseData = await eventbriteApiRequest.call(this, method, resource, body, query);
        query.continuation = responseData.pagination.continuation;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.pagination !== undefined &&
        responseData.pagination.has_more_items !== undefined &&
        responseData.pagination.has_more_items !== false);
    return returnData;
}
exports.eventbriteApiRequestAllItems = eventbriteApiRequestAllItems;
//# sourceMappingURL=GenericFunctions.js.map