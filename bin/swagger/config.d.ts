/// <reference types="express" />
import * as express from 'express';
import * as entities from '../entities';
export declare function registerSwaggerConfigInternal(app: express.Application, config: entities.IAuthConfig, swaggerBaseDir: string): Promise<string>;
