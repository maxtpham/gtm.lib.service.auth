/// <reference types="express" />
import * as express from 'express';
import { IAuthConfig } from '../config';
export declare function registerSwaggerApiInternal(app: express.Application, config: IAuthConfig, swaggerBaseDir: string, swaggerRouteDirs: string[]): Promise<void>;
