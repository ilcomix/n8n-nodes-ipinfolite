import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class IpinfoApi implements ICredentialType {
	name = 'ipinfoApi';
	displayName = 'IPinfo API';
	documentationUrl = 'https://ipinfo.io/developers';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your IPinfo API token. Get one at https://ipinfo.io/signup',
		},
	];

	// Basic Auth con token come username
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.apiToken}}',
				password: '',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.ipinfo.io',
			url: '/lite/me',
		},
	};
}
