import { Router } from 'express';
import { DocumentTemplateController } from '../controllers/document-template.controller';
import { BaseRouter } from "./base/base.router";

export class DocumentTemplateRouter extends BaseRouter<DocumentTemplateController> {
    public router: Router = Router();
    public documentTemplateController = new DocumentTemplateController();
    public resource: string;

    public constructor(){
        super();
        this.resource = '/document-templates';
        super.controller = this.documentTemplateController;
    }

    public getRouter(): Router {
        return super.getBaseRouter();
    }
}