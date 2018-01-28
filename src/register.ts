import * as express from "express";
import { CreateJwtTokenFunction, IAuthConfig, IOAuth2Config } from "./entities";
import { normalizeAuth, normalizeOAuth2 } from "./config";
import { registerJwtInternal } from "./auth/jwt";
import { registerOAuth2Internal } from "./auth/oauth2";
import { registerSwaggerApiInternal } from "./swagger/api";
import { registerSwaggerUiInternal } from "./swagger/ui";
import { registerSwaggerConfigInternal } from "./swagger/config";

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
    logoutUrl?: string,
}

/**
 * Register JWT & Swagger routes
 */
export async function registerAuth(app: express.Application, config: IAuthConfig, params: AuthParams, jwtIgnoreSwaggerUrl?: boolean): Promise<string> {
    // Normalize the config
    config = normalizeAuth(config);

    // register for JWT parser (every requests after this will need JWT auth header)
    registerJwtInternal(
        app,
        config.jwt,
        (!jwtIgnoreSwaggerUrl || !config.swagger.baseUrl) ? params.jwtIgnoreUrls : !params.jwtIgnoreUrls ? [config.swagger.baseUrl] : params.jwtIgnoreUrls.concat([config.swagger.baseUrl])
    );

    // Register Swagger API Routes
    await registerSwaggerApiInternal(app, config, params.swaggerBaseDir, config.swagger.outputDirs);

    // Register Swagger API Routes
    return registerSwaggerConfigInternal(app, config, params.swaggerBaseDir);
}

/**
 * Register OAuth2/JWT & Swagger routes, this function will call register for standard Auth
 */
export async function registerOAuth2(app: express.Application, config: IOAuth2Config, params: OAuth2Params) {
    // Normalize the config
    config = normalizeOAuth2(config);

    // Call to registration of standard Auth
    const defaultSwaggerConfigUrl = await registerAuth(app, config, params, true);

    // Register Swagger-UI 
    await registerSwaggerUiInternal(app, config, defaultSwaggerConfigUrl, params.createJwtToken);

    // Finally register JWT/OAuth2 with all supported passport.js Providers (Google, Facebook)
    Object.keys(config.auth).map((provider: string) => registerOAuth2Internal(
        app, provider, config, params.createJwtToken,
        `${(params.oauth2 || <OAuth2ParamUrls>{}).baseUrl || '/pub/auth'}/login/${provider}`,
        `${(params.oauth2 || <OAuth2ParamUrls>{}).baseUrl || '/pub/auth'}/callback/${provider}`,
        `${(params.oauth2 || <OAuth2ParamUrls>{}).baseUrl || '/pub/auth'}/failure/${provider}`,
        (params.oauth2 || <OAuth2ParamUrls>{}).logoutUrl || '/web/auth/logout'
    ));
}