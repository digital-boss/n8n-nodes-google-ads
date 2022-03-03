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

import {
	simplify
} from '../../../methods';

export async function create(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	// https://developers.google.com/google-ads/api/rest/reference/rest/v9/customers.userLists/mutate

	const customerId = this.getNodeParameter('customerId', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const uploadKeyType = this.getNodeParameter('uploadKeyType', index) as string;
	let appId;
	if (uploadKeyType === 'MOBILE_ADVERTISING_ID') {
		appId = this.getNodeParameter('app_id', index) as string;
	}
	const dataSourceType = this.getNodeParameter('dataSourceType', index) as IDataObject;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;
	const simplifyOutput = this.getNodeParameter('simplifyOutput', 0) as boolean;
	const qs = {} as IDataObject;
	const requestMethod = 'POST';
	const endpoint = `/${customerId}/userLists:mutate`;

	const userList: IDataObject = {
		name,
		crm_based_user_list: {
			upload_key_type: uploadKeyType,
			app_id: appId,
			data_source_type: dataSourceType,
		},
	};

	Object.assign(userList, additionalFields);

	const form = {
		operations: [
			{
				create: userList,
			},
		],
	} as IDataObject;

	let responseData = await apiRequest.call(this, requestMethod, endpoint, form, qs);
	if (simplifyOutput) {
		responseData = simplify(responseData);
	}

	return this.helpers.returnJsonArray(responseData);
}
