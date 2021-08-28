import { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-core';
export declare function awsApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, service: string, method: string, path: string, body?: string, headers?: object): Promise<any>;
export declare function awsApiRequestREST(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, service: string, method: string, path: string, body?: string, headers?: object): Promise<any>;
