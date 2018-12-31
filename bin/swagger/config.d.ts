import * as express from 'express';
import { IAuthConfig } from '../config';
export declare function registerSwaggerConfigInternal(app: express.Application, config: IAuthConfig, swaggerBaseDir: string): Promise<string>;
