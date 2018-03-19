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
const api_1 = require("./swagger/api");
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
//# sourceMappingURL=register.js.map