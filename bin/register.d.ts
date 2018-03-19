/// <reference types="express" />
import * as express from "express";
import { IAuthConfig } from "./config";
export interface AuthParams {
    /** The base __dirname relative to swagger Swagger outputDirs dirs (in config.swagger.outputDirs) */
    swaggerBaseDir: string;
    /** The list of Urls should be ignore by jwt authenticate (for check loggedin links): /web/auth/loggedin, /api/v1/auth/loggedin */
    jwtIgnoreUrls?: string[];
}
/**
 * Register JWT & Swagger routes
 */
export declare function registerAuth(app: express.Application, config: IAuthConfig, params: AuthParams, jwtIgnoreSwaggerUrl?: boolean): Promise<string>;
