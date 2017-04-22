import { Router } from 'express';
import { EnterpriseDocumentController } from '../controllers/enterprise-document.controller';
import { BaseRouter } from "./base/base.router";

export class EnterpriseDocumentRouter extends BaseRouter<EnterpriseDocumentController> {
    public router: Router = Router();
    public EnterpriseDocumentController = new EnterpriseDocumentController();
    public resource: string;

    public constructor(){
        super();
        this.resource = '/enterprise-documents';
        super.controller = this.EnterpriseDocumentController;
    }
}