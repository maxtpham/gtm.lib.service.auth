"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normalizeAuth(config) {
    if (!config.jwt)
        config.jwt = {};
    if (!config.jwt.headerField)
        config.jwt.headerField = 'x-token';
    if (!config.jwt.bodyField)
        config.jwt.bodyField = 'token';
    if (!config.jwt.queryField)
        config.jwt.queryField = 'token';
    if (!config.jwt.secret)
        config.jwt.secret = 'secret';
    if (!config.jwt.paths)
        config.jwt.paths = ['/web', '/api'];
    if (!config.swagger)
        config.swagger = {};
    if (!config.swagger.outputDirs)
        config.swagger.outputDirs = ['../swagger/output'];
    if (!config.swagger.baseUrl) {
        config.swagger.baseUrl = '/swagger';
    }
    else {
        if (config.swagger.baseUrl.endsWith('/')) {
            config.swagger.baseUrl = config.swagger.baseUrl.substr(0, config.swagger.baseUrl.length - 1);
        }
    }
    return config;
}
exports.normalizeAuth = normalizeAuth;
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
//# sourceMappingURL=config.js.map