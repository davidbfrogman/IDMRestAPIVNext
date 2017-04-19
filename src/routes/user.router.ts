import { Router } from 'express';
import { UserMI } from '../models/user';
import { UserController } from '../controllers/user.controller';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from '@types/express-serve-static-core';
import { IncomingMessage } from 'http';
import { BaseRouter } from "./base/base.router";

export class UserRouter extends BaseRouter<UserController> {
    public router: Router = Router();
    public UserController = new UserController();
    public resource: string;

    public constructor(){
        super();
        this.resource = '/Users';
        super.controller = this.UserController;
    }

    public getRouter(): Router {
        return super.getBaseRouter();
    }
}