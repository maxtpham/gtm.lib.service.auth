/// <reference types="express" />
/// <reference types="passport" />
import * as express from 'express';
import * as passport from "passport";
import * as entities from '../entities';
export declare class SwaggerUiAuth {
    protected baseUrl: string;
    constructor(baseUrl: string);
    /**
     * [GET /swagger/redirect?code=arg1&state=arg2] Redirect from SwaggerUI to dynamic generated Url to swagger-dist-ui oauth2-redirect.html
     */
    redirect(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
}
export declare class SwaggerUiAuthProvider {
    protected basePath: string;
    private provider;
    private config;
    private createJwtToken;
    private jwtSecret;
    private jwtPaths;
    constructor(basePath: string, provider: string, swaggerAuthConfig: entities.IOAuth2Config, jwtSecret: string, jwtPaths: string[], createJwtToken: entities.CreateJwtTokenFunction);
    /**
     * [GET /swagger/authorization/:provider?response_type=&client_id=&redirect_uri=&scope=&state] OAuth2 authorization proxy
     * to convert from selected scope to default Provider's auth code then encode the requested scopes in the cookies to process later
     */
    getAuthorization(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
    /**
     * [POST /swagger/token/:provider?grant_type=&code=&client_id=&client_secret=&redirect_uri] OAuth2 token exchange proxy: to exchange token code with Provider then convert to local token for SwaggerUI client
     */
    postToken(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
    static queryGoogleProfile(access_token: string, token_type?: string): Promise<passport.Profile>;
    private static parseGoogleProfile(json);
}
