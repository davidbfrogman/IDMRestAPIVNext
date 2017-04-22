import { Router } from 'express';
import { EnterpriseEnumerationController } from '../controllers/enterprise-enumeration.controller';
import { BaseRouter } from "./base/base.router";

export class EnterpriseEnumerationRouter extends BaseRouter<EnterpriseEnumerationController> {
    public router: Router = Router();
    public EnterpriseEnumerationController = new EnterpriseEnumerationController();
    public resource: string;

    public constructor(){
        super();
        this.resource = '/enterprise-enumerations';
        super.controller = this.EnterpriseEnumerationController;
    }
}