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
function normalizeOAuth2(config) {
    if (!config.rootUrl)
        config.rootUrl = config._url;
    if (!config.returnUrl)
        config.returnUrl = '/';
    if (!config.auth)
        config.auth = { google: {}, facebook: {} };
    if (config.auth.google) {
        if (!config.auth.google.authorizationUrl)
            config.auth.google.authorizationUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        if (!config.auth.google.tokenUrl)
            config.auth.google.tokenUrl = 'https://www.googleapis.com/oauth2/v4/token';
        if (!config.auth.google.scope)
            config.auth.google.scope = ['profile', 'email'];
        if (!config.auth.google.npm)
            config.auth.google.npm = { library: 'passport-google-oauth', class: 'OAuth2Strategy' };
    }
    if (config.auth.facebook) {
        if (!config.auth.facebook.authorizationUrl)
            config.auth.facebook.authorizationUrl = 'https://www.facebook.com/dialog/oauth';
        if (!config.auth.facebook.tokenUrl)
            config.auth.facebook.tokenUrl = 'https://graph.facebook.com/oauth/access_token';
        if (!config.auth.facebook.scope)
            config.auth.facebook.scope = ['public_profile'];
        if (!config.auth.facebook.npm)
            config.auth.facebook.npm = { library: 'passport-facebook', class: 'Strategy' };
    }
    return config;
}
exports.normalizeOAuth2 = normalizeOAuth2;
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
    "rootUrl": "http://localhost:3001",
    "returnUrl": "http://localhost:30010/bin/dev",
    "auth": {
        "google": {
            "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth",
            "tokenUrl": "https://www.googleapis.com/oauth2/v4/token",
            "scope": ["profile", "email"],
            "npm": {
                "library": "passport-google-oauth",
                "class": "OAuth2Strategy"
            },
            "options": {
                "clientID": "980942693683-uij086c1n3ar0cf8oin40ilunesb52au.apps.googleusercontent.com",
                "clientSecret": "NzD7eOzkcEh-ortZSXaHm3Kd"
            }
        },
        "facebook": {
            "authorizationUrl": "https://www.facebook.com/dialog/oauth",
            "tokenUrl": "https://graph.facebook.com/oauth/access_token",
            "scope": ["public_profile"],
            "npm": {
                "library": "passport-facebook",
                "class": "Strategy"
            },
            "options": {
                "clientID": "1983328695283502",
                "clientSecret": "cd595d42b38dbc0213e36f7eee740c88"
            }
        }
    },
 */ 
//# sourceMappingURL=config.js.map