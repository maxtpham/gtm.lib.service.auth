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
const Utils_1 = require("../lib/Utils");
function registerSwaggerApiInternal(app, config, swaggerBaseDir, swaggerRouteDirs) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(swaggerRouteDirs.map((swaggerRouteDir) => __awaiter(this, void 0, void 0, function* () {
            const dir = path.resolve(swaggerBaseDir, swaggerRouteDir);
            let filepaths;
            try {
                filepaths = yield Utils_1.Utils.enumFiles(dir, '.js', '.ts');
            }
            catch (ex) {
                console.error(`${config._log} registerSwaggerApiRoutes failed to list the files in ${dir}`, ex);
            }
            if (filepaths) {
                if (filepaths.length <= 0) {
                    console.error(`${config._log} registerSwaggerApiRoutes no *.js, *.ts files found in ${dir}`);
                }
                else {
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
        })));
    });
}
exports.registerSwaggerApiInternal = registerSwaggerApiInternal;
function registerSwaggerApiRoute(app, config, filepath) {
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
//# sourceMappingURL=api.js.map