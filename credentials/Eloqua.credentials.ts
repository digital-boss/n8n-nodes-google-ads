import { ICredentialType, INodeProperties } from "n8n-workflow";

export class Eventbrite implements ICredentialType {
  name = "eventbrite";
  displayName = "Oracle Eventbrite";
  documentationUrl = "eventbrite";
  properties: INodeProperties[] = [
    {
      displayName: "Company Name",
      name: "companyName",
      type: "string",
      default: "",
    },
    {
      displayName: "User Name",
      name: "userName",
      type: "string",
      default: "",
    },
    {
      displayName: "Password",
      name: "password",
      type: "string",
      default: "",
    },
  ];
}
