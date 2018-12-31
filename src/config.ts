import { IModuleConfig } from "@gtm/lib.service";

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

    if (typeof(process.env.JWT_HEADERFIELD) === 'string') config.jwt.headerField = process.env.JWT_HEADERFIELD; else if (!config.jwt.headerField) config.jwt.headerField = 'x-token';
    if (typeof(process.env.JWT_BODYFIELD) === 'string') config.jwt.bodyField = process.env.JWT_BODYFIELD; else if (!config.jwt.bodyField) config.jwt.bodyField = 'token';
    if (typeof(process.env.JWT_QUERYFIELD) === 'string') config.jwt.queryField = process.env.JWT_QUERYFIELD; else if (!config.jwt.queryField) config.jwt.queryField = 'token';
    if (typeof(process.env.JWT_SECRET) === 'string') config.jwt.secret = process.env.JWT_SECRET; else if (!config.jwt.secret) config.jwt.secret = 'secret';
    if (typeof(process.env.JWT_PATHS) === 'string') config.jwt.paths = process.env.JWT_PATHS.split(','); else if (!config.jwt.paths) config.jwt.paths = ['/web', '/api'];

    if (!config.swagger) config.swagger = <ISwaggerConfig>{};
    if (typeof(process.env.SWAGGER_OUTPUTDIRS) === 'string') config.swagger.outputDirs = process.env.SWAGGER_OUTPUTDIRS.split(','); else if (!config.swagger.outputDirs) config.swagger.outputDirs = [ '../swagger/output' ];
    if (typeof(process.env.SWAGGER_BASEURL) === 'string') config.swagger.baseUrl = process.env.SWAGGER_BASEURL; else if (!config.swagger.baseUrl) config.swagger.baseUrl = '/swagger'; else {
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