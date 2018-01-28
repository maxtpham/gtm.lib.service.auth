/// <reference types="express" />
import * as express from 'express';
import * as entities from '../entities';
/**
 * Register passport.js to extract jwt tokens from cookies & auth header
 */
export declare function registerJwtInternal(app: express.Application, jwtConfig: entities.IJwtConfig, jwtIgnoreUrls: string[]): void;
