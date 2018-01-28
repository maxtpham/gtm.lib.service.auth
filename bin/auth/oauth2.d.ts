/// <reference types="express" />
import * as express from 'express';
import * as entities from '../entities';
/**
 * @param app Auth Express Server
 * @param provider google/facebook
 * @param config hosting service rootUrl (http://localhost:3001), frontend page returnUrl(http://localhost:3000/bin/dev/) & providerConfig
 * @param publicLoginURL /pub/auth/login/google
 * @param publicCallbackURL /pub/auth/callback/google
 * @param publicFailureRedirect /pub/auth/failure/google
 * @param secureLogoutURL /web/auth/logout
 */
export declare function registerOAuth2Internal(app: express.Application, provider: string, config: entities.IOAuth2Config, createJwtToken: entities.CreateJwtTokenFunction, publicLoginURL: string, publicCallbackURL: string, publicFailureRedirect: string, secureLogoutURL: string, loggedinHandler?: express.RequestHandler, loginFailureHandler?: express.RequestHandler, loggedoutHandler?: express.RequestHandler): void;
