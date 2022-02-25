import {
	UserListProperties,
} from '../../Interfaces';

export const userListDescription: UserListProperties = [
	{
		displayName: 'User List Resource Name',
		name: 'userListResourceName',
		required: true,
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUserListResourceNames',
		},
		displayOptions: {
			show: {
				resource: ['userList'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The resource name of the user list',
	},
];
