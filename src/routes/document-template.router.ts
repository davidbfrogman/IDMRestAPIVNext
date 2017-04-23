import { Router } from 'express';
import { DocumentTemplateController } from '../controllers/document-template.controller';
import { BaseRouter } from "./base/base.router";
import { Constants } from "../constants";

export class DocumentTemplateRouter extends BaseRouter<DocumentTemplateController> {
    public router: Router = Router();
    public documentTemplateController = new DocumentTemplateController();
    public resource: string;

    public constructor(){
        super();
        this.resource = Constants.DocumentTemplatesEndpoint;
        super.controller = this.documentTemplateController;
    }
}