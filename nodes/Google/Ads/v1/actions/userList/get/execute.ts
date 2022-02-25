import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	NodeOperationError
} from 'n8n-workflow';

import {
	apiRequest,
} from '../../../transport';

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('googleAdsOAuth2Api') as IDataObject;
	const customerId = credentials.customerId as string;
	const userListId = this.getNodeParameter('userListId', index) as string;
	const qs = {} as IDataObject;
	const requestMethod = 'GET';
	const endpoint = `customers/${customerId}/userLists/${userListId}`;

	const responseData = await apiRequest.call(this, requestMethod, endpoint, undefined, qs);

	if (responseData.error) {
		throw new NodeOperationError(this.getNode(), responseData.error);
	}

	return this.helpers.returnJsonArray(responseData);
}
