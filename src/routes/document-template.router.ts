import { Router, Request, Response, RequestParamHandler, NextFunction } from "express";
import { DocumentTemplate } from "../models/document-template";
import {DocumentTemplateController} from '../controllers/document-template.controller';

export class DocumentTemplateRouter {
    private router: Router = Router();
    public documentTemplateController = new DocumentTemplateController();
    public getRouter(): Router {

        // this.router.get("/document-template", async(request: Request, response: Response) => {
        //     const documentTemplates = await DocumentTemplate.find({}).exec();
        //     response.json(documentTemplates);
        // });

        this.router.post("/document-template", async(request: Request, response: Response) => {
            const createdDocumentTemplate = await DocumentTemplate.create(request.body);
            response.status(200).json(createdDocumentTemplate);
        });
         this.router.get('/document-template', (req: Request, res: Response, next: NextFunction, id: any)=>{
             return  this.documentTemplateController(req,res,next);
         });
        // app.get('/posts/new', posts.new)
        // app.post('/posts', posts.create)
        // app.get('/posts/:id', posts.show)
        // app.get('/posts/:id/edit', posts.edit)
        // app.put('/posts/:id', posts.update)
        // app.del('/posts/:id', posts.destroy)

        return this.router;
    }
}