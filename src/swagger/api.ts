import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as express from 'express';
import { Utils } from '../lib/Utils';
import { IAuthConfig } from '../config';

export async function registerSwaggerApiInternal(app: express.Application, config: IAuthConfig, swaggerBaseDir: string, swaggerRouteDirs: string[]): Promise<void> {
    await Promise.all(swaggerRouteDirs.map(async swaggerRouteDir => {
        const dir = path.resolve(swaggerBaseDir, swaggerRouteDir);
        let filepaths: string[];
        try {
            filepaths = await Utils.enumFiles(dir, '.js', '.ts');
        } catch (ex) {
            console.error(`${config._log} registerSwaggerApiRoutes failed to list the files in ${dir}`, ex);
        }
        if (filepaths) {
            if (filepaths.length <= 0) {
                console.error(`${config._log} registerSwaggerApiRoutes no *.js, *.ts files found in ${dir}`);
            } else {
                filepaths.map(filepath => {
                    try {
                        registerSwaggerApiRoute(app, config, filepath);
                    }
                    catch (ex) {
                        console.error(`${config._log} registerSwaggerApiRoutes failed to process the file ${filepath}`, ex);
                    }
                });
            }
        }
    }));
}

function registerSwaggerApiRoute(app: express.Application, config: IAuthConfig, filepath: string) {
    console.log(`${config._log} SwaggerAPI Route - registering: ${filepath}`);
    let routesModule;
    try {
        routesModule = require(path.relative(__dirname, filepath));
    }
    catch (ex) {
        console.error(`${config._log} SwaggerAPI Route - module not found: ${filepath} @${path.relative(__dirname, filepath)}`, ex);
        return;
    }

    try {
        routesModule.RegisterRoutes(app);
        console.log(`${config._log} SwaggerAPI Route - registered: ${filepath}`);
    }
    catch (ex) {
        console.error(`${config._log} SwaggerAPI Route - registration failed: ${filepath}`, ex);
    }
}