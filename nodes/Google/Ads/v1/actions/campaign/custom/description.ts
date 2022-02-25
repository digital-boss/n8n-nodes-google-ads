import {
	CampaignProperties,
} from '../../Interfaces';

export const campaignDescription: CampaignProperties = [
	{
		displayName: 'Query',
		name: 'queryGQL',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'campaign',
				],
				operation: [
					'custom',
				],
			},
		},
		description: 'Custom query to run against the campaign endpoint.',
	},
];
