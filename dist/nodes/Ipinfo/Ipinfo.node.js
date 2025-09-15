"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ipinfo = void 0;
class Ipinfo {
    constructor() {
        this.description = {
            displayName: 'IPinfo Lite',
            name: 'ipinfolite',
            icon: 'file:ipinfo.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'IPinfo Lite API with comprehensive IP lookup capabilities',
            defaults: {
                name: 'IPinfo Lite',
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [
                {
                    name: 'ipinfoApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Get Self IP (General)',
                            value: 'getSelfGeneral',
                            description: 'Get general info for your own IP',
                        },
                        {
                            name: 'Get Lookup IP (General)',
                            value: 'getLookupGeneral',
                            description: 'Get general info for a specific IP',
                        },
                        {
                            name: 'Get Self IPv4',
                            value: 'getSelfIPv4',
                            description: 'Get IPv4 info for your own IP',
                        },
                        {
                            name: 'Get IPv4',
                            value: 'getIPv4',
                            description: 'Get IPv4 info for a specific IP',
                        },
                        {
                            name: 'Get Self IPv6',
                            value: 'getSelfIPv6',
                            description: 'Get IPv6 info for your own IP',
                        },
                        {
                            name: 'Get Lookup IPv6',
                            value: 'getLookupIPv6',
                            description: 'Get IPv6 info for a specific IP',
                        },
                        // IPinfo Base API
                        {
                            name: 'Base - JSON Info (Lookup)',
                            value: 'baseJsonLookup',
                            description: 'Get complete JSON info for specific IP',
                        },
                        {
                            name: 'Base - Organization (Lookup)',
                            value: 'baseOrgLookup',
                            description: 'Get organization as plaintext for specific IP',
                        },
                        {
                            name: 'Base - City (Lookup)',
                            value: 'baseCityLookup',
                            description: 'Get city as plaintext for specific IP',
                        },
                        {
                            name: 'Base - Country (Lookup)',
                            value: 'baseCountryLookup',
                            description: 'Get country code as plaintext for specific IP',
                        },
                    ],
                    default: 'getSelfGeneral',
                },
                {
                    displayName: 'IP Address',
                    name: 'ip',
                    type: 'string',
                    default: '8.8.8.8',
                    placeholder: '8.8.8.8',
                    description: 'IP address to lookup',
                    displayOptions: {
                        show: {
                            operation: [
                                'getLookupGeneral',
                                'getIPv4',
                                'getLookupIPv6',
                                'baseJsonLookup',
                                'baseOrgLookup',
                                'baseCityLookup',
                                'baseCountryLookup',
                            ],
                        },
                    },
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i);
            // Only get IP parameter for lookup operations
            const requiresIp = [
                'getLookupGeneral',
                'getIPv4',
                'getLookupIPv6',
                'baseJsonLookup',
                'baseOrgLookup',
                'baseCityLookup',
                'baseCountryLookup'
            ].includes(operation);
            const ip = requiresIp ? this.getNodeParameter('ip', i) : '';
            let url = '';
            switch (operation) {
                case 'getSelfGeneral':
                    url = 'https://api.ipinfo.io/lite/me';
                    break;
                case 'getLookupGeneral':
                    url = `https://api.ipinfo.io/lite/${ip}`;
                    break;
                case 'getSelfIPv4':
                    url = 'https://v4.api.ipinfo.io/lite/me';
                    break;
                case 'getIPv4':
                    url = `https://v4.api.ipinfo.io/lite/${ip}`;
                    break;
                case 'getSelfIPv6':
                    url = 'https://v6.api.ipinfo.io/lite/me';
                    break;
                case 'getLookupIPv6':
                    url = `https://v6.api.ipinfo.io/lite/${ip}`;
                    break;
                case 'baseJsonLookup':
                    url = `https://ipinfo.io/${ip}`;
                    break;
                case 'baseOrgLookup':
                    url = `https://ipinfo.io/${ip}/org`;
                    break;
                case 'baseCityLookup':
                    url = `https://ipinfo.io/${ip}/city`;
                    break;
                case 'baseCountryLookup':
                    url = `https://ipinfo.io/${ip}/country`;
                    break;
                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }
            try {
                const response = await this.helpers.httpRequestWithAuthentication.call(this, 'ipinfoApi', {
                    method: 'GET',
                    url: url,
                });
                // Use specific keys for plaintext endpoints
                let resultKey = 'ipinfo';
                if (operation === 'baseOrgLookup') {
                    resultKey = 'organization';
                }
                else if (operation === 'baseCityLookup') {
                    resultKey = 'city';
                }
                else if (operation === 'baseCountryLookup') {
                    resultKey = 'country';
                }
                returnData.push({
                    json: {
                        [resultKey]: response,
                        operation: operation,
                    },
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error instanceof Error ? error.message : String(error),
                            operation: operation,
                        },
                    });
                }
                else {
                    throw error;
                }
            }
        }
        return [returnData];
    }
}
exports.Ipinfo = Ipinfo;
