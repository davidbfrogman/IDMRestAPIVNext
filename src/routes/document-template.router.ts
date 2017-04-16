import { Router } from "express";
import { DocumentTemplate } from "../models/document-template";
import {DocumentTemplateController} from '../controllers/document-template.controller';
import { Request, Response } from 'express';
import { RequestHandlerParams } from "@types/express-serve-static-core";

export class DocumentTemplateRouter {
    private router: Router = Router();
    public documentTemplateController = new DocumentTemplateController();
    public getRouter(): Router {



        // this.router.post("/document-template", async(request: Request, response: Response) => {
        //     const createdDocumentTemplate = await DocumentTemplate.create(request.body);
        //     response.status(200).json(createdDocumentTemplate);
        // });
        this.router.get('/document-template/:id', function (params: RequestHandlerParams){
            //params.params.id
            console.log("Heres Params" + params);
             //return  this.documentTemplateController.Load(req,res,next)
         });
        //  this.router.get('/document-template', (req: Request, res: Response, next: Next)=>{
        //      return  this.documentTemplateController.Load(req,res,next)
        //  });

        // app.get('/posts/new', posts.new)
        // app.post('/posts', posts.create)
        // app.get('/posts/:id', posts.show)
        // app.get('/posts/:id/edit', posts.edit)
        // app.put('/posts/:id', posts.update)
        // app.del('/posts/:id', posts.destroy)

        return this.router;
    }
}