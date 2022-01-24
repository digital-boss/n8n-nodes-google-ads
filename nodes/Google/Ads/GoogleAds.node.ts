import { IExecuteFunctions } from "n8n-core";

import {
  IDataObject,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";

import {
  googleApiRequest,
} from "./GenericFunctions";

import { IData } from "./Interfaces";

export class GoogleAds implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Google Ads",
    name: "googleAds",
    icon: "file:google-ads.png",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: "Use the Google Ads API",
    defaults: {
      name: "Google Ads",
      color: "#772244",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "googleAdsApi",
        required: true,
        displayOptions: {
          show: {
            authentication: ["serviceAccount"],
          },
        },
      },
      {
        name: "googleAdsOAuth2",
        required: true,
        displayOptions: {
          show: {
            authentication: ["oAuth2"],
          },
        },
      },
    ],
    properties: [
      {
        displayName: "Authentication",
        name: "authentication",
        type: "options",
        options: [
          {
            name: "OAuth2",
            value: "oAuth2",
          },
          {
            name: "Service Account",
            value: "serviceAccount",
          },
        ],
        default: "oAuth2",
      },
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        options: [
          {
            name: "Customer Custom Audience",
            value: "customerCustomAudience",
          },
        ],
        default: "customerCustomAudience",
        description: "The resource to operate on.",
      },
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        options: [
          {
            name: "Get",
            value: "get",
          },
          {
            name: "Mutate",
            value: "mutate",
          },
        ],
        default: "get",
        description: "The operation to perform.",
      },
      {
        displayName: "Customer ID",
        name: "customerId",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: {
            resource: ["customerCustomAudience"],
            operation: ["get"],
          },
        },
        description:
          "The ID of the customer whose custom audiences are being fetched.",
      },
      {
        displayName: "Custom Audience ID",
        name: "customAudienceId",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: {
            resource: ["customerCustomAudience"],
            operation: ["get"],
          },
        },
        description: "The ID of the custom audience to fetch.",
      },
      {
        displayName: "Customer ID",
        name: "customerId",
        type: "string",
        default: "",
        required: true,
        displayOptions: {
          show: {
            resource: ["customerCustomAudience"],
            operation: ["mutate"],
          },
        },
        description:
          "The ID of the customer whose custom audiences are being modified.",
      },
      {
        displayName: "JSON body",
        name: "jsonBody",
        type: "json",
        default: "",
        required: true,
        displayOptions: {
          show: {
            resource: ["customerCustomAudience"],
            operation: ["mutate"],
          },
        },
        description: "The request body in JSON representation.",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];
    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;

    let method = "";
    const qs: IDataObject = {};
    let body: IDataObject = {};
    let endpoint = "";
    let responseData;
    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === "customerCustomAudience") {
          if (operation === "get") {
            method = "GET";

            const customerId = this.getNodeParameter("customerId", i) as string;
            const customAudienceId = this.getNodeParameter(
              "customAudienceId",
              i
            ) as string;
            endpoint = `/customers/${customerId}/customAudiences/${customAudienceId}`;

            responseData = await googleApiRequest.call(this, method, endpoint);
          }
          if (operation === "mutate") {
            method = "POST";

            const customerId = this.getNodeParameter("customerId", i) as string;
            endpoint = `/customers/${customerId}/customAudiences:mutate`;

            body = this.getNodeParameter("jsonBody", i) as IDataObject;
            if (typeof body === "string") {
              body = JSON.parse(body);
            }

            responseData = await googleApiRequest.call(this, method, endpoint, body);
          }
        }
        
        if (Array.isArray(responseData)) {
          returnData.push.apply(returnData, responseData as IDataObject[]);
        } else if (responseData !== undefined) {
          returnData.push(responseData as IDataObject);
        }
      } catch (error) {
        if (this.continueOnFail()) {
          //@ts-ignore
          returnData.push({ error: error.message });
          continue;
        }
        throw error;
      }
    }
    return [this.helpers.returnJsonArray(returnData)];
  }
}
