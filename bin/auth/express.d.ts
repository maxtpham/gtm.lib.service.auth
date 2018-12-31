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
export declare function expressAuthentication(request: express.Request, securityName: string, requestedScopes?: string[]): Promise<any>;
