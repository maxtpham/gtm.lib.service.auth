import * as express from "express";
import { normalizeAuth, IAuthConfig } from "./config";
import { registerJwtInternal } from "./auth/jwt";
import { registerSwaggerApiInternal } from "./swagger/api";
import { registerSwaggerConfigInternal } from "./swagger/config";

export interface AuthParams {
    /** The base __dirname relative to swagger Swagger outputDirs dirs (in config.swagger.outputDirs) */
    swaggerBaseDir: string;

    /** The list of Urls should be ignore by jwt authenticate (for check loggedin links): /web/auth/loggedin, /api/v1/auth/loggedin */
    jwtIgnoreUrls?: string[];
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