"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowHooks = void 0;
class WorkflowHooks {
    constructor(hookFunctions, mode, executionId, workflowData, optionalParameters) {
        optionalParameters = optionalParameters || {};
        this.hookFunctions = hookFunctions;
        this.mode = mode;
        this.executionId = executionId;
        this.workflowData = workflowData;
        this.sessionId = optionalParameters.sessionId;
        this.retryOf = optionalParameters.retryOf;
    }
    async executeHookFunctions(hookName, parameters) {
        if (this.hookFunctions[hookName] !== undefined && Array.isArray(this.hookFunctions[hookName])) {
            for (const hookFunction of this.hookFunctions[hookName]) {
                await hookFunction.apply(this, parameters);
            }
        }
    }
}
exports.WorkflowHooks = WorkflowHooks;
//# sourceMappingURL=WorkflowHooks.js.map