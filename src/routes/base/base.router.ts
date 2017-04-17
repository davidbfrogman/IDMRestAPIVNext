import { Router } from 'express';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from '@types/express-serve-static-core';
import { IncomingMessage } from 'http';
import { BaseController } from "../../controllers/base/base.controller";
import { Schema, Model, Document } from 'mongoose';

export abstract class BaseRouter<TController extends BaseController<Document>>{
    public abstract router: Router;
    public abstract resource: string;
    public abstract getRouter(): Router;
    public controller: TController;

    public constructor() {

    }

    public getBaseRouter(): Router {
        this.router.all(`${this.resource}`, async (request: Request, response: Response, next: NextFunction) => {
            //You can put logic here that needs to be run for every request.
            //For instance we could do authentication here.
            next();
        })
        //Listing Operation
        .get(`${this.resource}`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.list(request, response, next);
        })
        //Query Operation for sending a post query json object
        .post(`${this.resource}/query`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.query(request, response, next);
        })
        //Blank Operation for returning a blank new'd up object. Useful for seeing defaults on an object
        .get(`${this.resource}/blank`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.blank(request, response, next);
        })
        //Count Operation for seeing how many of a resource there is, which accepts query object
        .get(`${this.resource}/count`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.count(request, response, next);
        })
        //Get Single Operation
        .get(`${this.resource}/:id`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.single(request, response, next);
        })
        //Create New Operation
        .post(`${this.resource}`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.create(request, response, next);
        })
        //Updates a single resource
        .put(`${this.resource}/:id`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.update(request, response, next);
        })
        //Removes a single resource by id
        .delete(`${this.resource}/:id`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.destroy(request, response, next);
        });

        return this.router;
    }
}