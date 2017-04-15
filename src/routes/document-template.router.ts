import { Router, Request, Response } from "express";
import { DocumentTemplate } from "../models/document-template";

export class DocumentTemplateRouter {
    private router: Router = Router();
    public getRouter(): Router {

        this.router.get("/document-template", async(request: Request, response: Response) => {
            const documentTemplates = await DocumentTemplate.find({}).exec();
            response.json(documentTemplates);
        });

        this.router.post("/document-template", async(request: Request, response: Response) => {
            const createdDocumentTemplate = await DocumentTemplate.create(request.body);
            response.status(200).json(createdDocumentTemplate);
        });

        // this.router.get('/posts', posts.index)
        // app.get('/posts/new', posts.new)
        // app.post('/posts', posts.create)
        // app.get('/posts/:id', posts.show)
        // app.get('/posts/:id/edit', posts.edit)
        // app.put('/posts/:id', posts.update)
        // app.del('/posts/:id', posts.destroy)

        return this.router;
    }
}