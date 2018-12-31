import * as express from 'express';
import { IJwtConfig } from '../config';
/**
 * Register passport.js to extract jwt tokens from cookies & auth header
 */
export declare function registerJwtInternal(app: express.Application, jwtConfig: IJwtConfig, jwtIgnoreUrls: string[]): void;
