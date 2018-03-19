import * as express from 'express';
import * as passport from "passport";
import * as passportJwt from "passport-jwt";
import * as jwt from "jsonwebtoken";
import * as _ from 'lodash';
import { IJwtConfig } from '../config';

let JwtEmptyValue: string;
let JwtIgnoreValue: string;
const JwtHandler = passport.authenticate('jwt', { session: false });
let JwtExtractor: passportJwt.JwtFromRequestFunction;

/**
 * Register passport.js to extract jwt tokens from cookies & auth header
 */
export function registerJwtInternal(app: express.Application, jwtConfig: IJwtConfig, jwtIgnoreUrls: string[]) {
    passport.use(new passportJwt.Strategy(<passportJwt.StrategyOptions>{
        secretOrKey: jwtConfig.secret,
        passReqToCallback: false,
        jwtFromRequest: (JwtExtractor = passportJwt.ExtractJwt.fromExtractors([
            passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            passportJwt.ExtractJwt.fromHeader(jwtConfig.headerField),
            passportJwt.ExtractJwt.fromBodyField(jwtConfig.bodyField),
            passportJwt.ExtractJwt.fromUrlQueryParameter(jwtConfig.queryField),
            jwtCookieExtractor
        ]))
    }, jwtVerify));
    if (!!jwtIgnoreUrls) {
        JwtIgnoreValue = jwt.sign({'$':2}, jwtConfig.secret, { expiresIn: Number.MAX_VALUE });
        jwtIgnoreUrls.map(path => app.use(path, jwtIgnoreHandler));
    }
    if (!!jwtConfig.paths) {
        JwtEmptyValue = jwt.sign({'$':1}, jwtConfig.secret, { expiresIn: Number.MAX_VALUE });
        jwtConfig.paths.map(path => app.use(path, jwtEmptyHandler));
    }
}

function jwtEmptyHandler(req: express.Request, res: express.Response, next: express.NextFunction): any {
    if (!req.cookies.jwt) {
        req.cookies.jwt = JwtExtractor(req) || JwtEmptyValue;
    }
    return JwtHandler(req, res, next);
}

function jwtIgnoreHandler(req: express.Request, res: express.Response, next: express.NextFunction): any {
    if (!req.cookies.jwt) {
        req.cookies.jwt = JwtExtractor(req) || JwtIgnoreValue;
    }
    return JwtHandler(req, res, next);
}

function jwtCookieExtractor(req: express.Request): string {
    return !req.cookies ? undefined : req.cookies.jwt;
};

function jwtVerify(payload: any, done: passportJwt.VerifiedCallback) {
    done(null, payload);
}
