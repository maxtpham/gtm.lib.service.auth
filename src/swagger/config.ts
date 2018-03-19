import * as express from 'express';
import * as path from 'path';

import { StaticFile } from '@gtm/lib.service';
import { Utils } from '../lib/Utils';
import { IAuthConfig } from '../config';

export async function registerSwaggerConfigInternal(app: express.Application, config: IAuthConfig, swaggerBaseDir: string): Promise<string> {
    // Swagger config files
    let defaultSwaggerConfigUrl: string;
    await Promise.all(config.swagger.outputDirs.map(async swaggerOutputDir => {
        const swaggerOutputPath = path.resolve(swaggerBaseDir, process.env.NODE_ENV === 'production' ? '../' : './', swaggerOutputDir);
        let swaggerConfigPaths;
        try {
            swaggerConfigPaths = await Utils.enumFiles(swaggerOutputPath, '.json');
        } catch (ex) {
            console.error(`${config._log} registerSwaggerUIHandler-Config(${swaggerOutputPath}) failed to list config files: ${ex}`);
        }
        if (swaggerConfigPaths) {
            if (swaggerConfigPaths.length <= 0) {
                console.error(`${config._log} registerSwaggerUIHandler-Config(${swaggerOutputPath}) no *.json files found`);
            } else {
                swaggerConfigPaths.map(swaggerConfigPath => {
                    const staticFile = new StaticFile(swaggerConfigPath);
                    const routePath = config.swagger.baseUrl + '/' + config._name + '/' + staticFile.name;
                    app.get(routePath, staticFile.handler);
                    if (!defaultSwaggerConfigUrl) {
                        defaultSwaggerConfigUrl = routePath;
                    }
                    console.log(`${config._log} SwaggerConfig GET ${config._url}${routePath} -> ${swaggerConfigPath}`);
                });
            }
        }
    }));

    return Promise.resolve(defaultSwaggerConfigUrl);
}