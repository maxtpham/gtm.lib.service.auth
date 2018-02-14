import * as entities from '../entities';
import * as passport from "passport";
import { AttachmentView } from '@gtm/lib.service/bin';
import * as request from 'request';

/** to transform the Passport.profile into generic profile with some additional fields to store into system DB */
abstract class OAuth2ProfileTransform {
    protected verifyCb: entities.CreateJwtTokenFunction;
    constructor(verifyCb: entities.CreateJwtTokenFunction) {
        this.verifyCb = verifyCb;
    }

    public get handler(): entities.VerifyJwtTokenFunction {
        return this.handle.bind(this);
    }

    protected abstract handle(accessToken: string, refreshToken: string, providerSession: entities.ProviderSession, profile: passport.Profile, done: (error: any, user?: any, info?: any) => void): Promise<void>;

    protected async fetchPhoto(url: string): Promise<AttachmentView> {
        return new Promise<AttachmentView>((resolve, reject) => {
            request({ url }, function (error, response, body) {
                if (!!error) {
                    reject(error);
                } else {
                    if (body && response.statusCode < 300 && response.headers['content-type']) {
                        resolve(<AttachmentView>{ media: response.headers['content-type'], data: body })
                    } else {
                        reject(new Error(`Fetch photo error from ${url}: ${response.statusCode}-${response.statusMessage}`));
                    }
                }
            });
        });
    }
}

class GoogleOAuth2VerifyCallback extends OAuth2ProfileTransform {
    protected async handle(accessToken: string, refreshToken: string, providerSession: entities.ProviderSession, profile: passport.Profile, done: (error: any, user?: any, info?: any) => void): Promise<void> {
        const profileExt: entities.OAuth2ProfileExt = {
            id: profile.id,
            name: profile.displayName,
            email: !profile.emails || profile.emails.length <= 0 ? undefined : profile.emails[0].value,
            gender: (<any>profile)._json.gender,
            avatar: !profile.photos || profile.photos.length <= 0 ? undefined : await super.fetchPhoto(profile.photos[0].value),
            address: !(<any>profile)._json.placesLived || (<any>profile)._json.placesLived.length <= 0 ? (<any>profile)._json.url : (<any>profile)._json.placesLived[0].value,
            timezone: undefined,
            language: (<any>profile)._json.language
        };
        await this.verifyCb(accessToken, refreshToken, providerSession, profile, profileExt, done);
    }
}

class FacebookOAuth2VerifyCallback extends OAuth2ProfileTransform {

    static locale2Language(locale: string): string {
        const pos = locale.indexOf('_');
        return pos <= 0 ? locale : locale.substr(0, pos);
    }

    protected async handle(accessToken: string, refreshToken: string, providerSession: entities.ProviderSession, profile: passport.Profile, done: (error: any, user?: any, info?: any) => void): Promise<void> {
        const profileExt: entities.OAuth2ProfileExt = {
            id: profile.id,
            name: profile.displayName,
            email: !profile.emails || profile.emails.length <= 0 ? undefined : profile.emails[0].value,
            gender: (<any>profile)._json.gender,
            avatar: !profile.photos || profile.photos.length <= 0 ? undefined : await super.fetchPhoto(profile.photos[0].value),
            address: (<any>profile)._json.profileUrl,
            timezone: (<any>profile)._json.timezone,
            language: !(<any>profile)._json.locale ? undefined : FacebookOAuth2VerifyCallback.locale2Language((<any>profile)._json.locale)
        };
        await this.verifyCb(accessToken, refreshToken, providerSession, profile, profileExt, done);
    }
}

export default function transform(provider: string, verifyCb: entities.CreateJwtTokenFunction): entities.VerifyJwtTokenFunction {
    switch (provider) {
        case 'facebook':
            return new FacebookOAuth2VerifyCallback(verifyCb).handler;
        case 'google':
            return new GoogleOAuth2VerifyCallback(verifyCb).handler;
        default:
            throw new Error('Not supported provider: ' + provider);
    }
}