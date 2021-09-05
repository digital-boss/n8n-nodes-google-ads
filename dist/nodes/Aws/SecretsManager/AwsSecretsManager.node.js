"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsSecretsManager = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class AwsSecretsManager {
    constructor() {
        this.description = {
            displayName: 'AWS Secrets Manager',
            name: 'awsSecretsManager',
            icon: 'file:secrets-manager.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Consume AWS Secrets Manager API',
            defaults: {
                name: 'AWS Secrets Manager',
                color: '#ea3e40'
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'aws',
                    required: true
                }
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Get Secret Value',
                            value: 'getSecretValue'
                        }
                    ],
                    default: 'getSecretValue',
                    description: 'The operation to perform.'
                },
                {
                    displayName: 'Secret ID',
                    name: 'SecretId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['getSecretValue']
                        }
                    },
                    description: 'Specifies the secret containing the version that you want to retrieve. You can specify either the Amazon Resource Name (ARN) or the friendly name of the secret.'
                },
                {
                    displayName: 'Version ID',
                    name: 'VersionId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['getSecretValue']
                        }
                    },
                    description: "Specifies the unique identifier of the version of the secret that you want to retrieve. If you specify both this parameter and VersionStage, the two parameters must refer to the same secret version. If you don't specify either a VersionStage or VersionId then the default is to perform the operation on the version with the VersionStage value of AWSCURRENT."
                },
                {
                    displayName: 'Version Stage',
                    name: 'VersionStage',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['getSecretValue']
                        }
                    },
                    description: "Specifies the secret version that you want to retrieve by the staging label attached to the version. Staging labels are used to keep track of different versions during the rotation process. If you specify both this parameter and VersionId, the two parameters must refer to the same secret version . If you don't specify either a VersionStage or VersionId, then the default is to perform the operation on the version with the VersionStage value of AWSCURRENT."
                },
                {
                    displayName: 'Decode JSON String',
                    name: 'decode',
                    type: 'boolean',
                    default: true,
                    displayOptions: {
                        show: {
                            operation: ['getSecretValue']
                        }
                    },
                    description: "Option to decode the JSON String recieved from the API. Result is added to the Workflow data."
                }
            ]
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const qs = {};
        let responseData;
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                if (operation === 'getSecretValue') {
                    let action = 'secretsmanager.GetSecretValue';
                    const body = {};
                    const SecretId = this.getNodeParameter('SecretId', i);
                    const VersionId = this.getNodeParameter('VersionId', i);
                    const VersionStage = this.getNodeParameter('VersionStage', i);
                    body.SecretId = SecretId;
                    if (VersionId) {
                        body.VersionId = VersionId;
                    }
                    if (VersionStage) {
                        body.VersionStage = VersionStage;
                    }
                    responseData = await GenericFunctions_1.awsApiRequestREST.call(this, 'secretsmanager', 'POST', '', JSON.stringify(body), {
                        'X-Amz-Target': action,
                        'Accept-Encoding': 'identity',
                        'Content-Type': 'application/x-amz-json-1.1'
                    });
                    const decode = this.getNodeParameter('decode', i);
                    if (decode) {
                        responseData.decodedValue = JSON.parse(responseData.SecretString);
                    }
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else {
                    returnData.push(responseData);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message });
                    continue;
                }
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.AwsSecretsManager = AwsSecretsManager;
//# sourceMappingURL=AwsSecretsManager.node.js.map