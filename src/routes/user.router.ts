import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { BaseRouter } from "./base/base.router";

export class UserRouter extends BaseRouter<UserController> {
    public router: Router = Router();
    public UserController = new UserController();
    public resource: string;

    public constructor(){
        super();
        this.resource = '/users';
        super.controller = this.UserController;
    }

    public getRouter(): Router {
        return super.getBaseRouter();
    }
}