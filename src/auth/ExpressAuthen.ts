import * as express from "express";

/**
 * The Express.js authentication entry for TSOA
 */
export function expressAuthentication(request: express.Request, securityName: string, requestedScopes?: string[]): Promise<any> {
    if (securityName === 'jwt') {
        return new Promise((resolve, reject) => {
            const user = (<any>request).user;
            if (!user || user['$'] === 1) { // Not loggedin or Empty JWT value
                const err = new Error("Not logged in or Invalid user session");
                (<any>err).__nolog = true;
                reject(err);
            } else if (user['$'] === 2 || ((user.scope === null || user.scope.length <= 0) && (!requestedScopes || requestedScopes.length <= 0))) {
                resolve(user); // Ignore JWT value, or JWT is admin, or the API does not require any scope
            } else {
                // Check if JWT contains all required scopes
                for (let requestedScope of requestedScopes) {
                    if (!user.scope[requestedScope]) {
                        const err = new Error("User is not permitted to execute the action");
                        (<any>err).__nolog = true;
                        reject(err);
                    }
                }
                resolve(user);
            }
        });
    }
}