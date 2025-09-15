"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpinfoApi = void 0;
class IpinfoApi {
    constructor() {
        this.name = 'ipinfoApi';
        this.displayName = 'IPinfo API';
        this.documentationUrl = 'https://ipinfo.io/developers';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                auth: {
                    username: '={{$credentials.apiToken}}',
                    password: '',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://api.ipinfo.io',
                url: '/lite/me',
            },
        };
    }
}
exports.IpinfoApi = IpinfoApi;
