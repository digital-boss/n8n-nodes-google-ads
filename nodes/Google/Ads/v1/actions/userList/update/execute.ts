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

export async function update(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('googleAdsOAuth2Api') as IDataObject;
	const customerId = credentials.customerId as string;
	const userListResourceName = this.getNodeParameter('userListResourceName', index) as IDataObject;
	const crmBasedUserList = this.getNodeParameter('userListFields', index) as IDataObject;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;
	const simplifyOutput = this.getNodeParameter('simplifyOutput', 0) as boolean;
	const qs = {} as IDataObject;
	const requestMethod = 'POST';
	const endpoint = `customers/${customerId}/userLists:mutate`;

	const userList: IDataObject = {
		resourceName: userListResourceName,
		crmBasedUserList,
	};
	Object.assign(userList, additionalFields);

	const updateMask = Object.keys(userList)
		.splice(Object.keys(userList).indexOf('resource_name'), 1) // remove resource_name from mask
		.map(field => 'user_list.' + field) // prepend 'user_list.'
		.join(','); // merge in comma separated string

	Object.assign(userList, additionalFields);

	const form = {
		operations: [
			{
				updateMask,
				update: userList,
			},
		],
	} as IDataObject;

	let responseData = await apiRequest.call(this, requestMethod, endpoint, form, qs);
	if (simplifyOutput) {
		responseData = simplify(responseData);
	}

	return this.helpers.returnJsonArray(responseData);
}
