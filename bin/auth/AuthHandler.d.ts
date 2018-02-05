/// <reference types="express" />
import * as express from 'express';
import { IModuleConfig } from '@gtm/lib.service';
export interface ReturnUrlRequest extends express.Request {
    _returnUrl: string;
}
export declare class AuthHandler {
    private config;
    private provider;
    private jwtSecret;
    private cookiePaths;
    constructor(config: IModuleConfig, provider: string, jwtSecret: string, cookiePaths: string[]);
    loggedinHandler(req: express.Request, res: express.Response, next: express.NextFunction): void;
    /**
     * [OAuth2] Callback Url for Provider to return for notify the completion of the authentication process (with result)
     */
    loginFailureHandler(req: express.Request, res: express.Response, next: express.NextFunction): void;
    /**
     * [OAuth2] Logout interface called by user action on UI to terminate current passport session
     */
    logoutHandler(req: ReturnUrlRequest, res: express.Response, next: express.NextFunction): void;
}
