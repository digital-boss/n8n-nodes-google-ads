import { IExecuteFunctions, IExecuteSingleFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-core';
import { IDataObject } from 'n8n-workflow';
export declare function eventbriteApiRequest(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: string, resource: string, body?: any, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function eventbriteApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: string, resource: string, body?: any, query?: IDataObject): Promise<any>;
