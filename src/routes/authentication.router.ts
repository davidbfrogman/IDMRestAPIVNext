import { Router } from 'express';
import { AuthenticationController } from '../controllers/authentication.controller';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from '@types/express-serve-static-core';
import { IncomingMessage } from 'http';
import { BaseRouter } from './base/base.router';

export class AuthenticationRouter extends BaseRouter<AuthenticationController> {
    public router: Router = Router();
    public authenticationController = new AuthenticationController();
    public resource: string = '';

    public constructor() {
        super();
        super.controller = this.authenticationController;
    }

    public getRouter(): Router {
        return this.router
            .post(`${this.resource}`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.authenticate(request, response, next);
            })
            .post(`${this.resource}/refresh`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.refreshToken(request, response, next);
            });
    }

    public authenticationRequestValidation(request: Request, response: Response, next: NextFunction): Response{
        return new AuthenticationController().authenticationRequestValidation(request,response,next);
    }
}