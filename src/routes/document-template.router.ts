import { Router } from 'express';
import { DocumentTemplate } from '../models/document-template';
import { DocumentTemplateController } from '../controllers/document-template.controller';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from '@types/express-serve-static-core';
import { IncomingMessage } from 'http';

export class DocumentTemplateRouter {
    private router: Router = Router();
    public documentTemplateController = new DocumentTemplateController();

    public getRouter(): Router {

        this.router.get('/document-templates', async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.documentTemplateController.list(request, response);
            }
            catch (error) { next(error) }
        });

        this.router.post('/document-templates/query', async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.documentTemplateController.query(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.get('/document-templates/blank', async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.documentTemplateController.blank(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.get('/document-templates/count', async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.documentTemplateController.count(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.get('/document-templates/:id', async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.documentTemplateController.single(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.post('/document-templates', async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.documentTemplateController.create(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.put('/document-templates/:id', async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.documentTemplateController.update(request, response, next);
            }
            catch (error) { next(error) }
        });

        this.router.delete('/document-templates/:id', async (request: Request, response: Response, next: NextFunction) => {
            try {
                await this.documentTemplateController.destroy(request, response, next);
            }
            catch (error) { next(error) }
        });


        // this.router.get('/document-templates/blank', this.documentTemplateController.blank);
        // this.router.get('/document-templates/:id', this.documentTemplateController.single);
        // this.router.post('/document-templates', this.documentTemplateController.create);
        // this.router.put('/document-templates/:id', this.documentTemplateController.update);
        // this.router.delete('/document-templates/:id', this.documentTemplateController.destroy);

        return this.router;
    }
}