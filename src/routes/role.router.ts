import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { BaseRouter } from "./base/base.router";

export class RoleRouter extends BaseRouter<RoleController> {
    public router: Router = Router();
    public RoleController = new RoleController();
    public resource: string;

    public constructor(){
        super();
        this.resource = '/roles';
        super.controller = this.RoleController;
    }

    public getRouter(): Router {
        return super.getBaseRouter();
    }
}