/// <reference types="express" />
import * as express from 'express';
import * as entities from '../entities';
export declare function registerSwaggerUiInternal(app: express.Application, config: entities.IOAuth2Config, defaultSwaggerConfigUrl: string, createJwtToken: entities.CreateJwtTokenFunction): Promise<void>;
