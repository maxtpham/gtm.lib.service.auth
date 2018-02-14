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
const request = require("request");
/** to transform the Passport.profile into generic profile with some additional fields to store into system DB */
class OAuth2ProfileTransform {
    constructor(verifyCb) {
        this.verifyCb = verifyCb;
    }
    get handler() {
        return this.handle.bind(this);
    }
    fetchPhoto(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                request({ url }, function (error, response, body) {
                    if (!!error) {
                        reject(error);
                    }
                    else {
                        if (body && response.statusCode < 300 && response.headers['content-type']) {
                            resolve({ media: response.headers['content-type'], data: body });
                        }
                        else {
                            reject(new Error(`Fetch photo error from ${url}: ${response.statusCode}-${response.statusMessage}`));
                        }
                    }
                });
            });
        });
    }
}
class GoogleOAuth2VerifyCallback extends OAuth2ProfileTransform {
    handle(accessToken, refreshToken, providerSession, profile, done) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const profileExt = {
                id: profile.id,
                name: profile.displayName,
                email: !profile.emails || profile.emails.length <= 0 ? undefined : profile.emails[0].value,
                gender: profile._json.gender,
                avatar: !profile.photos || profile.photos.length <= 0 ? undefined : yield _super("fetchPhoto").call(this, profile.photos[0].value),
                address: !profile._json.placesLived || profile._json.placesLived.length <= 0 ? profile._json.url : profile._json.placesLived[0].value,
                timezone: undefined,
                language: profile._json.language
            };
            return _super("verifyCb").call(this, accessToken, refreshToken, providerSession, profile, profileExt, done);
        });
    }
}
class FacebookOAuth2VerifyCallback extends OAuth2ProfileTransform {
    static locale2Language(locale) {
        const pos = locale.indexOf('_');
        return pos <= 0 ? locale : locale.substr(0, pos);
    }
    handle(accessToken, refreshToken, providerSession, profile, done) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const profileExt = {
                id: profile.id,
                name: profile.displayName,
                email: !profile.emails || profile.emails.length <= 0 ? undefined : profile.emails[0].value,
                gender: profile._json.gender,
                avatar: !profile.photos || profile.photos.length <= 0 ? undefined : yield _super("fetchPhoto").call(this, profile.photos[0].value),
                address: profile._json.profileUrl,
                timezone: profile._json.timezone,
                language: !profile._json.locale ? undefined : FacebookOAuth2VerifyCallback.locale2Language(profile._json.locale)
            };
            return _super("verifyCb").call(this, accessToken, refreshToken, providerSession, profile, profileExt, done);
        });
    }
}
function transform(provider, verifyCb) {
    switch (provider) {
        case 'facebook':
            return new FacebookOAuth2VerifyCallback(verifyCb).handler;
        case 'google':
            return new GoogleOAuth2VerifyCallback(verifyCb).handler;
        default:
            throw new Error('Not supported provider: ' + provider);
    }
}
exports.default = transform;
//# sourceMappingURL=oauth2.transform.js.map