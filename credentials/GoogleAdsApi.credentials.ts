import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

const scopes = [
	'https://www.googleapis.com/auth/adwords',
];


export class GoogleAdsApi implements ICredentialType {
	name = 'googleAdsApi';
	extends = [
		'googleApi',
	];
	displayName = 'Google Ads API';
	documentationUrl = 'google';
	properties: INodeProperties[] = [
		{
			displayName: 'Developer Token',
			name: 'developerToken',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Ignore SSL Issues',
			name: 'allowUnauthorizedCerts',
			type: 'boolean',
			default: false,
		},
	];
}
