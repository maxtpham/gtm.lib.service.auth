/// <reference types="express" />
import * as express from "express";
import { CreateJwtTokenFunction, IAuthConfig, IOAuth2Config } from "./entities";
export interface AuthParams {
    /** The base __dirname relative to swagger Swagger outputDirs dirs (in config.swagger.outputDirs) */
    swaggerBaseDir: string;
    /** The list of Urls should be ignore by jwt authenticate (for check loggedin links): /web/auth/loggedin, /api/v1/auth/loggedin */
    jwtIgnoreUrls?: string[];
}
export interface OAuth2Params extends AuthParams {
    /** The callback to create the user token and persist to data store */
    createJwtToken: CreateJwtTokenFunction;
    oauth2?: OAuth2ParamUrls;
}
export interface OAuth2ParamUrls {
    /** The baseUrl for all links login, callback, failure; default to: /pub/auth. The login link will be /pub/auth/login/<provider> */
    baseUrl?: string;
    /** The UI link to logout user session, default to: /web/auth/logout */
    logoutUrl?: string;
}
/**
 * Register JWT & Swagger routes
 */
export declare function registerAuth(app: express.Application, config: IAuthConfig, params: AuthParams, jwtIgnoreSwaggerUrl?: boolean): Promise<string>;
/**
 * Register OAuth2/JWT & Swagger routes, this function will call register for standard Auth
 */
export declare function registerOAuth2(app: express.Application, config: IOAuth2Config, params: OAuth2Params): Promise<void>;
