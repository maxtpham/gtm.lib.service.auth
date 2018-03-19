import * as passport from "passport";
import { IModuleConfig } from "@gtm/lib.service/bin";

export interface IAuthConfig extends IModuleConfig {
    jwt: IJwtConfig;
    swagger: ISwaggerConfig;
}

export interface ISwaggerConfig {
    /** baseUrl for Swagger-UI, default to /swagger */
    baseUrl?: string;
    /** The system will search the folders for
     * - *.ts & *.js for routes then register for Swagger API routes
     * - *.json for config then expose these config for Swagger UI client (the file name will be kept as is)
     */
    outputDirs: string[];
}

export interface IJwtConfig {
    headerField: string;
    bodyField: string;
    queryField: string;
    secret: string;
    paths: string[];
}

export function normalizeAuth(config: IAuthConfig): IAuthConfig {
    if (!config.jwt) config.jwt = <IJwtConfig>{};
    if (!config.jwt.headerField) config.jwt.headerField = 'x-token';
    if (!config.jwt.bodyField) config.jwt.bodyField = 'token';
    if (!config.jwt.queryField) config.jwt.queryField = 'token';
    if (!config.jwt.secret) config.jwt.secret = 'secret';
    if (!config.jwt.paths) config.jwt.paths = ['/web', '/api'];

    if (!config.swagger) config.swagger = <ISwaggerConfig>{};
    if (!config.swagger.outputDirs) config.swagger.outputDirs = [ '../swagger/output' ];
    if (!config.swagger.baseUrl) {
        config.swagger.baseUrl = '/swagger';
    } else {
        if (config.swagger.baseUrl.endsWith('/')) {
            config.swagger.baseUrl = config.swagger.baseUrl.substr(0, config.swagger.baseUrl.length - 1);
        }
    }
    
    return config;
}

/**
    "jwt": {
        "headerField": "x-token",
        "bodyField": "token",
        "queryField": "token",
        "secret": "secret",
        "paths": ["/web", "/api"]
    },
    "swagger": {
        "baseUrl": "/swagger",
        "outputDirs": [ "../swagger/output" ]
    },
 */