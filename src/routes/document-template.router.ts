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

        return this.router;
    }
}