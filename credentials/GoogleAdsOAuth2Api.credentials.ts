import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

const scopes = [
	'https://www.googleapis.com/auth/adwords',
];


export class GoogleAdsOAuth2Api implements ICredentialType {
	name = 'googleAdsOAuth2';
	extends = [
		'googleOAuth2Api',
	];
	displayName = 'Google Ads OAuth2 API';
	documentationUrl = 'google';
	properties: INodeProperties[] = [
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: scopes.join(' '),
		},
		{
			displayName: 'Ignore SSL Issues',
			name: 'allowUnauthorizedCerts',
			type: 'boolean',
			default: false,
		},
	];
}
