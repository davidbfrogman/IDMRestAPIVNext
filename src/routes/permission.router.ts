import { Router } from 'express';
import { PermissionMI } from '../models/permission';
import { PermissionController } from '../controllers/permission.controller';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from '@types/express-serve-static-core';
import { IncomingMessage } from 'http';
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

    public getRouter(): Router {
        return super.getBaseRouter();
    }
}