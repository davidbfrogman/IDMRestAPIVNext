import { Router } from 'express';
import { DocumentEntityController } from '../controllers/document-entity.controller';
import { BaseRouter } from "./base/base.router";
import { Constants } from "../constants";

export class DocumentEntityRouter extends BaseRouter<DocumentEntityController> {
    public router: Router = Router();
    public documentEntityController = new DocumentEntityController();
    public resource: string;

    public constructor(){
        super();
        this.resource = Constants.DocumentEntitiesEndpoint;
        super.controller = this.documentEntityController;
    }
}