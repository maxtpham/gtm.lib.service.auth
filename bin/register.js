"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const jwt_1 = require("./auth/jwt");
const oauth2_1 = require("./auth/oauth2");
const api_1 = require("./swagger/api");
const ui_1 = require("./swagger/ui");
const config_2 = require("./swagger/config");
/**
 * Register JWT & Swagger routes
 */
function registerAuth(app, config, params, jwtIgnoreSwaggerUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        // Normalize the config
        config = config_1.normalizeAuth(config);
        // register for JWT parser (every requests after this will need JWT auth header)
        jwt_1.registerJwtInternal(app, config.jwt, (!jwtIgnoreSwaggerUrl || !config.swagger.baseUrl) ? params.jwtIgnoreUrls : !params.jwtIgnoreUrls ? [config.swagger.baseUrl] : params.jwtIgnoreUrls.concat([config.swagger.baseUrl]));
        // Register Swagger API Routes
        yield api_1.registerSwaggerApiInternal(app, config, params.swaggerBaseDir, config.swagger.outputDirs);
        // Register Swagger API Routes
        return config_2.registerSwaggerConfigInternal(app, config, params.swaggerBaseDir);
    });
}
exports.registerAuth = registerAuth;
/**
 * Register OAuth2/JWT & Swagger routes, this function will call register for standard Auth
 */
function registerOAuth2(app, config, params) {
    return __awaiter(this, void 0, void 0, function* () {
        // Normalize the config
        config = config_1.normalizeOAuth2(config);
        // Call to registration of standard Auth
        const defaultSwaggerConfigUrl = yield registerAuth(app, config, params, true);
        // Register Swagger-UI 
        yield ui_1.registerSwaggerUiInternal(app, config, defaultSwaggerConfigUrl, params.createJwtToken);
        // Finally register JWT/OAuth2 with all supported passport.js Providers (Google, Facebook)
        Object.keys(config.auth).map((provider) => oauth2_1.registerOAuth2Internal(app, provider, config, params.createJwtToken, `${(params.oauth2 || {}).baseUrl || '/pub/auth'}/login/${provider}`, `${(params.oauth2 || {}).baseUrl || '/pub/auth'}/callback/${provider}`, `${(params.oauth2 || {}).baseUrl || '/pub/auth'}/failure/${provider}`, (params.oauth2 || {}).logoutUrl || '/web/auth/logout'));
    });
}
exports.registerOAuth2 = registerOAuth2;
//# sourceMappingURL=register.js.map