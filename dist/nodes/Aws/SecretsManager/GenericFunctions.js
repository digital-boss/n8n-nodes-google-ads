"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsApiRequestREST = exports.awsApiRequest = void 0;
const url_1 = require("url");
const aws4_1 = require("aws4");
const n8n_workflow_1 = require("n8n-workflow");
function getEndpointForService(service, credentials) {
    let endpoint;
    if (service === 'lambda' && credentials.lambdaEndpoint) {
        endpoint = credentials.lambdaEndpoint;
    }
    else if (service === 'sns' && credentials.snsEndpoint) {
        endpoint = credentials.snsEndpoint;
    }
    else if (service === 'sqs' && credentials.sqsEndpoint) {
        endpoint = credentials.sqsEndpoint;
    }
    else {
        endpoint = `https://${service}.${credentials.region}.amazonaws.com`;
    }
    return endpoint.replace('{region}', credentials.region);
}
async function awsApiRequest(service, method, path, body, headers) {
    const credentials = await this.getCredentials('aws');
    if (credentials === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No credentials got returned!');
    }
    const endpoint = new url_1.URL(getEndpointForService(service, credentials) + path);
    const signOpts = { headers: headers || {}, host: endpoint.host, method, path, body };
    (0, aws4_1.sign)(signOpts, { accessKeyId: `${credentials.accessKeyId}`.trim(), secretAccessKey: `${credentials.secretAccessKey}`.trim() });
    const options = {
        headers: signOpts.headers,
        method,
        uri: endpoint.href,
        body: signOpts.body,
    };
    try {
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { parseXml: true });
    }
}
exports.awsApiRequest = awsApiRequest;
async function awsApiRequestREST(service, method, path, body, headers) {
    const response = await awsApiRequest.call(this, service, method, path, body, headers);
    try {
        return JSON.parse(response);
    }
    catch (error) {
        return response;
    }
}
exports.awsApiRequestREST = awsApiRequestREST;
//# sourceMappingURL=GenericFunctions.js.map