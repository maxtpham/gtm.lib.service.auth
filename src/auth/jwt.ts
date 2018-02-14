import * as express from 'express';
import * as passport from "passport";
import * as passportJwt from "passport-jwt";
import * as jwt from "jsonwebtoken";

import * as entities from '../entities';
import * as _ from 'lodash';

let JwtEmptyValue: string;
let JwtIgnoreValue: string;
const JwtHandler = passport.authenticate('jwt', { session: false });

/**
 * Register passport.js to extract jwt tokens from cookies & auth header
 */
export function registerJwtInternal(app: express.Application, jwtConfig: entities.IJwtConfig, jwtIgnoreUrls: string[]) {
    JwtEmptyValue = jwt.sign({'$':1}, jwtConfig.secret, { expiresIn: Number.MAX_VALUE });
    JwtIgnoreValue = jwt.sign({'$':2}, jwtConfig.secret, { expiresIn: Number.MAX_VALUE });
    passport.use(new passportJwt.Strategy(<passportJwt.StrategyOptions>{
        secretOrKey: jwtConfig.secret,
        passReqToCallback: false,
        jwtFromRequest: passportJwt.ExtractJwt.fromExtractors([
            passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            passportJwt.ExtractJwt.fromHeader(jwtConfig.headerField),
            passportJwt.ExtractJwt.fromBodyField(jwtConfig.bodyField),
            passportJwt.ExtractJwt.fromBodyField(jwtConfig.queryField),
            jwtCookieExtractor
        ])
    }, jwtVerify));
    jwtIgnoreUrls.map(path => app.use(path, jwtIgnoreHandler));
    jwtConfig.paths.map(path => app.use(path, jwtEmptyHandler));
}

function jwtEmptyHandler(req: express.Request, res: express.Response, next: express.NextFunction): any {
    if (!req.cookies.jwt) {
        req.cookies.jwt = JwtEmptyValue;
    }
    return JwtHandler(req, res, next);
}

function jwtIgnoreHandler(req: express.Request, res: express.Response, next: express.NextFunction): any {
    if (!req.cookies.jwt) {
        req.cookies.jwt = JwtIgnoreValue;
    }
    return JwtHandler(req, res, next);
}

function jwtCookieExtractor(req: express.Request): string {
    return !req.cookies ? undefined : req.cookies.jwt;
};

function jwtVerify(payload: any, done: passportJwt.VerifiedCallback) {
    done(null, payload);
}
