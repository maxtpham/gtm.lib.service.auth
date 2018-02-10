"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passportJwt = require("passport-jwt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
let JwtEmptyValue;
const JwtHandler = passport.authenticate('jwt', { session: false });
/**
 * Register passport.js to extract jwt tokens from cookies & auth header
 */
function registerJwtInternal(app, jwtConfig, jwtIgnoreUrls) {
    JwtEmptyValue = jwt.sign({ '$': 1 }, jwtConfig.secret, { expiresIn: Number.MAX_VALUE });
    passport.use(new passportJwt.Strategy({
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
    // if (!!jwtIgnoreUrls) {
    //     jwtIgnoreUrls.map(jwtIgnore => app.use(jwtIgnore, jwtEmptyHandler));
    // }
    // jwtConfig.paths.map(path => app.use(path, JwtHandler));
    // All the path should be allowed to work without JWT
    _.union(jwtConfig.paths, jwtIgnoreUrls).map(path => app.use(path, jwtEmptyHandler));
}
exports.registerJwtInternal = registerJwtInternal;
function jwtEmptyHandler(req, res, next) {
    if (!req.cookies.jwt) {
        req.cookies.jwt = JwtEmptyValue;
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