import { Router } from 'express';
import { DocumentTemplateMI } from '../models/document-template';
import { DocumentTemplateController } from '../controllers/document-template.controller';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from '@types/express-serve-static-core';
import { IncomingMessage } from 'http';
import { BaseRouter } from "./base/base.router";

export class DocumentTemplateRouter extends BaseRouter<DocumentTemplateController> {
    public router: Router = Router();
    public documentTemplateController = new DocumentTemplateController();
    public routeRoot: string;

    public constructor(){
        super();
        this.routeRoot = '/document-templates';
        super.controller = this.documentTemplateController;
    }

    public getRouter(): Router {
        return super.getBaseRouter();
    }
}