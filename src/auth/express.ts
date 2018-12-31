import * as express from "express";
import { MapOfBoolean } from "@gtm/lib.common";

export interface JwtToken {
    /** User's display name */
    name: string;
    session: string;
    user: string;
    /** List of roles for quicky checking */
    roles: MapOfBoolean;
    /** List of scope or null is all scope (*) */
    scope: MapOfBoolean;
    /** Valid until */
    expires: number;
}

/**
 * The Express.js authentication entry for TSOA
 */
export function expressAuthentication(request: express.Request, securityName: string[], requestedScopes?: string[]): Promise<any> {
    if (!!securityName && securityName.length > 0 && securityName.indexOf('jwt') >= 0) {
        return new Promise((resolve, reject) => {
            const user = <JwtToken>(<any>request).user;
            if (!user || user['$'] === 1) { // Not loggedin or Empty JWT value
                const err = new Error("Not logged in or Invalid user session");
                (<any>err).__nolog = true;
                reject(err);
            } else if (user['$'] === 2 || (user.scope === null && (!requestedScopes || requestedScopes.length <= 0))) {
                resolve(user); // Ignore JWT value, or JWT is admin, or the API does not require any scope
            } else {
                // Check if JWT contains all required scopes
                for (let requestedScope of requestedScopes) {
                    if (!user.scope[requestedScope] || !user.roles[requestedScope]) {
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