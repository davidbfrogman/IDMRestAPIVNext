import { Router } from 'express';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from '@types/express-serve-static-core';
import { IncomingMessage } from 'http';
import { BaseController } from "../../controllers/base/base.controller";
import { Schema, Model, Document } from 'mongoose';

export abstract class BaseRouter<TController extends BaseController<Document>>{
    public abstract router: Router;
    public abstract routeRoot: string;
    public abstract getRouter(): Router;
    public controller: TController;

    public constructor() {

    }

    public getBaseRouter(): Router {

        this.router.get(`${this.routeRoot}`, async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.controller.list(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.post(`${this.routeRoot}/query`, async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.controller.query(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.get(`${this.routeRoot}/blank`, async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.controller.blank(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.get(`${this.routeRoot}/count`, async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.controller.count(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.get(`${this.routeRoot}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.controller.single(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.post(`${this.routeRoot}`, async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.controller.create(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.put(`${this.routeRoot}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.controller.update(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.delete(`${this.routeRoot}/:id`, async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.controller.destroy(request, response, next);
            }
            catch (error) { next(error) }
        });

        return this.router;
    }
}