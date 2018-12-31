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
export declare function normalizeAuth(config: IAuthConfig): IAuthConfig;
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
