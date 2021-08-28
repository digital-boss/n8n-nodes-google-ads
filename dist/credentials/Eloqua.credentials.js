"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eventbrite = void 0;
class Eventbrite {
    constructor() {
        this.name = "eventbrite";
        this.displayName = "Oracle Eventbrite";
        this.documentationUrl = "eventbrite";
        this.properties = [
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
}
exports.Eventbrite = Eventbrite;
//# sourceMappingURL=Eloqua.credentials.js.map