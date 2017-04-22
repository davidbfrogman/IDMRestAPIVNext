import { Router } from 'express';
import { PermissionController } from '../controllers/permission.controller';
import { BaseRouter } from "./base/base.router";

export class PermissionRouter extends BaseRouter<PermissionController> {
    public router: Router = Router();
    public PermissionController = new PermissionController();
    public resource: string;

    public constructor(){
        super();
        this.resource = '/permissions';
        super.controller = this.PermissionController;
    }
}