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
 * https://github.com/lukeautry/tsoa/#authentication
 */
export function expressAuthentication(request: express.Request, name: string, scopes?: string[]): Promise<any> {
    return name !== 'jwt' ? Promise.resolve() : new Promise((resolve, reject) => {
        const user = <JwtToken>(<any>request).user;
        if (!user || user['$'] === 1) { // Not loggedin or Empty JWT value
            const err = new Error("Not logged in or Invalid user session");
            (<any>err).__nolog = true;
            return reject(err);
        } else if (user['$'] === 2 || (user.scope === null && (!scopes || scopes.length <= 0))) {
            return resolve(user); // Ignore JWT value, or JWT is admin, or the API does not require any scope
        } else {
            // Check if JWT contains all required scopes
            for (let requestedScope of scopes) {
                if (!(!!user.scope && !!user.scope[requestedScope]) || !(!!user.roles && !!user.roles[requestedScope])) {
                    const err = new Error("User is not permitted to execute the action");
                    (<any>err).__nolog = true;
                    return reject(err);
                }
            }
            return resolve(user);
        }
    });
}