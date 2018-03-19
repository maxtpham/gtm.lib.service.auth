"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The Express.js authentication entry for TSOA
 */
function expressAuthentication(request, securityName, requestedScopes) {
    if (securityName === 'jwt') {
        return new Promise((resolve, reject) => {
            const user = request.user;
            if (!user || user['$'] === 1) {
                const err = new Error("Not logged in or Invalid user session");
                err.__nolog = true;
                reject(err);
            }
            else if (user['$'] === 2 || (user.scope === null && (!requestedScopes || requestedScopes.length <= 0))) {
                resolve(user); // Ignore JWT value, or JWT is admin, or the API does not require any scope
            }
            else {
                // Check if JWT contains all required scopes
                for (let requestedScope of requestedScopes) {
                    if (!user.scope[requestedScope] || !user.roles[requestedScope]) {
                        const err = new Error("User is not permitted to execute the action");
                        err.__nolog = true;
                        reject(err);
                    }
                }
                resolve(user);
            }
        });
    }
}
exports.expressAuthentication = expressAuthentication;
//# sourceMappingURL=express.js.map