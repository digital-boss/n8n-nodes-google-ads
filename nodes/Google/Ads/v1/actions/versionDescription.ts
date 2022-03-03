import {
	INodeProperties,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as campaign from './campaign';
import * as userList from './userList';
import * as search from './search';

export const versionDescription: INodeTypeDescription = {
	displayName: 'Google Ads',
	name: 'googleAds',
	icon: 'file:googleAds.svg',
	group: ['transform'],
	version: 1,
	subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
	description: 'Use the Google Ads API',
	defaults: {
		name: 'Google Ads',
		color: '#1A82e2',
	},
	inputs: ['main'],
	outputs: ['main'],
	credentials: [
		{
			name: 'googleAdsOAuth2Api',
			required: true,
		},
	],
	properties: [
		{
			displayName: 'Customer ID',
			name: 'customerId',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: 'getAccessibleCustomers',
			},
			required: true,
			default: '',
			description: 'The Google Ads customer ID of the account to which data is uploaded. Be sure to remove any hyphens (—), for example: 1234567890, not 123-456-7890.',
		},
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			options: [
				// {
				// 	name: 'Campaign',
				// 	value: 'campaign',
				// },
				{
					name: 'User List',
					value: 'userList',
				},
				{
					name: 'Search',
					value: 'search',
				},
			],
			default: 'campaign',
			description: 'The resource to operate on',
		},
		// ...campaign.descriptions,
		...userList.descriptions,
		...search.descriptions,
	],
};
