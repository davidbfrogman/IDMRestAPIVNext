import { Router } from 'express';
import { EnterpriseEnumerationController } from '../controllers/enterprise-enumeration.controller';
import { BaseRouter } from "./base/base.router";
import { Constants } from "../constants";

export class EnterpriseEnumerationRouter extends BaseRouter<EnterpriseEnumerationController> {
    public router: Router = Router();
    public enterpriseEnumerationController = new EnterpriseEnumerationController();
    public resource: string;

    public constructor(){
        super();
        this.resource = Constants.EnterpriseEnumerationsEndpoint;
        super.controller = this.enterpriseEnumerationController;
    }
}