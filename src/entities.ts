import { IModuleConfig, AttachmentView } from "@gtm/lib.service";
import * as passport from "passport";
import { MapOfBoolean } from "@gtm/lib.common";

export interface ProviderSession {
    name: string;
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
}

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

export interface OAuth2ProfileExt {
    id: string;
    name?: string;
    email?: string;
    gender?: string;
    avatar?: string;
    address?: string;
    timezone?: number;
    language?: string;
}

export type CreateJwtTokenFunction =
    (accessToken: string, refreshToken: string, providerSession: ProviderSession, profile: passport.Profile, profileExt: OAuth2ProfileExt, done: (error: any, user?: any, info?: any) => void) => Promise<void>;

export type VerifyJwtTokenFunction =
    (accessToken: string, refreshToken: string, providerSession: ProviderSession, profile: passport.Profile, done: (error: any, user?: any, info?: any) => void) => Promise<void>;

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

export interface IOAuth2Config extends IAuthConfig {
    /** root Url for OAuth2 app, normally the public Url to services.user */
    rootUrl: string;
    /** The default return url that will be redirected by OAuth2 for all case (logged in, logged out, logged failure) */
    returnUrl: string,
    /** OAuth2 provider specific config */
    auth: { [key: string]: IOAuth2Config };
}

export interface IOAuth2Config {
    authorizationUrl: string;
    tokenUrl: string;
    scope: string[];
    npm: {
        library: string;
        class: string;
    };
    options: IOAuth2OptionConfig;
}

export interface IOAuth2OptionConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    passReqToCallback: true;
}
