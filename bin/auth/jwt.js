"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passportJwt = require("passport-jwt");
const jwt = require("jsonwebtoken");
let JwtEmptyValue;
let JwtIgnoreValue;
const JwtHandler = passport.authenticate('jwt', { session: false });
/**
 * Register passport.js to extract jwt tokens from cookies & auth header
 */
function registerJwtInternal(app, jwtConfig, jwtIgnoreUrls) {
    passport.use(new passportJwt.Strategy({
        secretOrKey: jwtConfig.secret,
        passReqToCallback: false,
        jwtFromRequest: passportJwt.ExtractJwt.fromExtractors([
            passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            passportJwt.ExtractJwt.fromHeader(jwtConfig.headerField),
            passportJwt.ExtractJwt.fromBodyField(jwtConfig.bodyField),
            passportJwt.ExtractJwt.fromUrlQueryParameter(jwtConfig.queryField),
            jwtCookieExtractor
        ])
    }, jwtVerify));
    if (!!jwtIgnoreUrls) {
        JwtIgnoreValue = jwt.sign({ '$': 2 }, jwtConfig.secret, { expiresIn: Number.MAX_VALUE });
        jwtIgnoreUrls.map(path => app.use(path, jwtIgnoreHandler));
    }
    if (!!jwtConfig.paths) {
        JwtEmptyValue = jwt.sign({ '$': 1 }, jwtConfig.secret, { expiresIn: Number.MAX_VALUE });
        jwtConfig.paths.map(path => app.use(path, jwtEmptyHandler));
    }
}
exports.registerJwtInternal = registerJwtInternal;
function jwtEmptyHandler(req, res, next) {
    if (!req.cookies.jwt) {
        req.cookies.jwt = JwtEmptyValue;
    }
    return JwtHandler(req, res, next);
}
function jwtIgnoreHandler(req, res, next) {
    if (!req.cookies.jwt) {
        req.cookies.jwt = JwtIgnoreValue;
    }
    return JwtHandler(req, res, next);
}
function jwtCookieExtractor(req) {
    return !req.cookies ? undefined : req.cookies.jwt;
}
;
function jwtVerify(payload, done) {
    done(null, payload);
}
//# sourceMappingURL=jwt.js.map