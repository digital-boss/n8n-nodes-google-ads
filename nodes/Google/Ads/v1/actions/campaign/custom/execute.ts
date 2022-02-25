import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';

import {
	apiRequest,
} from '../../../transport';

export async function create(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('googleAdsOAuth2Api') as IDataObject;
	const customerId = credentials.customerId as string;
	const queryGQL = this.getNodeParameter('queryGQL', index) as string;
	const qs = {} as IDataObject;
	const requestMethod = 'POST';
	const endpoint = `customers/${customerId}/googleAds:search`;

	const form = {
		query: queryGQL,
	} as IDataObject;

	const responseData = await apiRequest.call(this, requestMethod, endpoint, form, qs);

	return this.helpers.returnJsonArray(responseData);
}
