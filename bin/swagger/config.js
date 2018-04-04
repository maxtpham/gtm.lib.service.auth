"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const lib_service_1 = require("@gtm/lib.service");
const Utils_1 = require("../lib/Utils");
function registerSwaggerConfigInternal(app, config, swaggerBaseDir) {
    return __awaiter(this, void 0, void 0, function* () {
        // Swagger config files
        let defaultSwaggerConfigUrl;
        yield Promise.all(config.swagger.outputDirs.map((swaggerOutputDir) => __awaiter(this, void 0, void 0, function* () {
            const swaggerOutputPath = path.resolve(swaggerBaseDir, process.env.NODE_ENV === 'production' ? '../' : './', swaggerOutputDir);
            let swaggerConfigPaths;
            try {
                swaggerConfigPaths = yield Utils_1.Utils.enumFiles(swaggerOutputPath, '.json');
            }
            catch (ex) {
                console.error(`${config._log} registerSwaggerUIHandler-Config(${swaggerOutputPath}) failed to list config files: ${ex}`);
            }
            if (swaggerConfigPaths) {
                if (swaggerConfigPaths.length <= 0) {
                    console.error(`${config._log} registerSwaggerUIHandler-Config(${swaggerOutputPath}) no *.json files found`);
                }
                else {
                    swaggerConfigPaths.map(swaggerConfigPath => {
                        const staticFile = new lib_service_1.StaticFile(swaggerConfigPath);
                        const routePath = config.swagger.baseUrl + '/' + config._name + '/' + staticFile.name;
                        app.get(routePath, staticFile.handler);
                        if (!defaultSwaggerConfigUrl) {
                            defaultSwaggerConfigUrl = routePath;
                        }
                        console.log(`${config._log} SwaggerConfig GET ${(config.https ? config.https._url : config._url) || config._url}${routePath} -> ${swaggerConfigPath}`);
                    });
                }
            }
        })));
        return Promise.resolve(defaultSwaggerConfigUrl);
    });
}
exports.registerSwaggerConfigInternal = registerSwaggerConfigInternal;
//# sourceMappingURL=config.js.map