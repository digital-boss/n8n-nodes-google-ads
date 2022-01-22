import {
	OptionsWithUri,
} from 'request';

import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	ICredentialDataDecryptedObject,
	ICredentialTestFunctions,
	IDataObject,
	JsonObject,
	NodeApiError, NodeOperationError,
} from 'n8n-workflow';

import * as moment from 'moment-timezone';

import * as jwt from 'jsonwebtoken';

export async function googleApiRequest(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: string,
	endpoint: string, body: any = {}, qs: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const authenticationMethod = this.getNodeParameter('authentication', 0, 'serviceAccount') as string;

	let options: OptionsWithUri = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method,
		body,
		qs,
		uri: uri || `https://adsreporting.googleapis.com${endpoint}`,
		json: true,
	};

	options = Object.assign({}, options, option);
	try {
		if (Object.keys(body).length === 0) {
			delete options.body;
		}
		if (Object.keys(qs).length === 0) {
			delete options.qs;
		}

		if (authenticationMethod === 'serviceAccount') {
			const credentials = await this.getCredentials('googleApi');

			if (credentials === undefined) {
				throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
			}

			const { access_token } = await getAccessToken.call(this, credentials as ICredentialDataDecryptedObject);

			options.headers!.Authorization = `Bearer ${access_token}`;
			//@ts-ignore
			return await this.helpers.request(options);
		} else {
			//@ts-ignore
			return await this.helpers.requestOAuth2.call(this, 'googleAdsOAuth2', options);
		}

	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function googleApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, propertyName: string, method: string, endpoint: string, body: any = {}, query: IDataObject = {}, uri?: string): Promise<any> { // tslint:disable-line:no-any

	const returnData: IDataObject[] = [];

	let responseData;

	do {
		responseData = await googleApiRequest.call(this, method, endpoint, body, query, uri);
		if (body.reportRequests && Array.isArray(body.reportRequests)) {
			body.reportRequests[0]['pageToken'] = responseData[propertyName][0].nextPageToken;
		} else {
			body.pageToken = responseData['nextPageToken'];
		}
		returnData.push.apply(returnData, responseData[propertyName]);
	} while (
		(responseData['nextPageToken'] !== undefined &&
			responseData['nextPageToken'] !== '') ||
		(responseData[propertyName] &&
			responseData[propertyName][0].nextPageToken &&
			responseData[propertyName][0].nextPageToken !== undefined)
	);

	return returnData;
}


export function getAccessToken(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | ICredentialTestFunctions, credentials: ICredentialDataDecryptedObject): Promise<IDataObject> {
	//https://developers.google.com/identity/protocols/oauth2/service-account#httprest

	const scopes = [
		'https://www.googleapis.com/auth/adwords',
	];

	const now = moment().unix();

	const signature = jwt.sign(
		{
			'iss': credentials.email as string,
			'sub': credentials.delegatedEmail || credentials.email as string,
			'scope': scopes.join(' '),
			'aud': `https://oauth2.googleapis.com/token`,
			'iat': now,
			'exp': now + 3600,
		},
		credentials.privateKey as string,
		{
			algorithm: 'RS256',
			header: {
				'kid': credentials.privateKey as string,
				'typ': 'JWT',
				'alg': 'RS256',
			},
		},
	);

	const options: OptionsWithUri = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
		form: {
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion: signature,
		},
		uri: 'https://oauth2.googleapis.com/token',
		json: true,
	};

	//@ts-ignore
	return this.helpers.request(options);
}

export function simplify(responseData: any | [any]) { // tslint:disable-line:no-any
	const response = [];
	for (const { columnHeader: { dimensions }, data: { rows } } of responseData) {
		if (rows === undefined) {
			// Do not error if there is no data
			continue;
		}
		for (const row of rows) {
			const data: IDataObject = {};
			if (dimensions) {
				for (let i = 0; i < dimensions.length; i++) {
					data[dimensions[i]] = row.dimensions[i];
					data['total'] = row.metrics[0].values.join(',');
				}
			} else {
				data['total'] = row.metrics[0].values.join(',');
			}
			response.push(data);
		}
	}
	return response;
}

export function merge(responseData: [any]) { // tslint:disable-line:no-any
	const response: { columnHeader: IDataObject, data: { rows: [] } } = {
		columnHeader: responseData[0].columnHeader,
		data: responseData[0].data,
	};
	const allRows = [];
	for (const { data: { rows } } of responseData) {
		allRows.push(...rows);
	}
	response.data.rows = allRows as [];
	return [response];
}
