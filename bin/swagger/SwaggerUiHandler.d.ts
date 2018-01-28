/// <reference types="express" />
import * as express from 'express';
export declare class SwaggerUiHandler {
    private homePath;
    private rootUrl;
    private baseUrl;
    private staticHandler;
    private index_html;
    private swagger_ui_bundle_js;
    private defaultSwaggerConfigUrl;
    constructor(rootUrl: string, baseUrl: string, defaultSwaggerConfigUrl: string);
    getRoot(req: express.Request, res: express.Response, next: express.NextFunction): any;
    getIndex(req: express.Request, res: express.Response, next: express.NextFunction): any;
    getSwaggerUiBundle(req: express.Request, res: express.Response, next: express.NextFunction): any;
    getStaticHandler(): express.RequestHandler;
    private processFileIndex(source);
    private processSwaggerUiBundle(source);
}
