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
	const userListResourceName = this.getNodeParameter('userListResourceName', index) as string;
	const qs = {} as IDataObject;
	const requestMethod = 'GET';
	const endpoint = userListResourceName;

	const responseData = await apiRequest.call(this, requestMethod, endpoint, undefined, qs);

	if (responseData.error) {
		throw new NodeOperationError(this.getNode(), responseData.error);
	}

	return this.helpers.returnJsonArray(responseData);
}
