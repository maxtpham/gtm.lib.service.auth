"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The Express.js authentication entry for TSOA
 * https://github.com/lukeautry/tsoa/#authentication
 */
function expressAuthentication(request, name, scopes) {
    return name !== 'jwt' ? Promise.resolve() : new Promise((resolve, reject) => {
        const user = request.user;
        if (!user || user['$'] === 1) { // Not loggedin or Empty JWT value
            const err = new Error("Not logged in or Invalid user session");
            err.__nolog = true;
            return reject(err);
        }
        else if (user['$'] === 2 || (user.scope === null && (!scopes || scopes.length <= 0))) {
            return resolve(user); // Ignore JWT value, or JWT is admin, or the API does not require any scope
        }
        else {
            // Check if JWT contains all required scopes
            for (let requestedScope of scopes) {
                if (!(!!user.scope && !!user.scope[requestedScope]) && !(!!user.roles && !!user.roles[requestedScope])) {
                    const err = new Error("User is not permitted to execute the action");
                    err.__nolog = true;
                    return reject(err);
                }
            }
            return resolve(user);
        }
    });
}
exports.expressAuthentication = expressAuthentication;
//# sourceMappingURL=express.js.map