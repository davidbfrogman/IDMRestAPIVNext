import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { BaseRouter } from "./base/base.router";
import { Constants } from "../constants";
import { Config } from '../config/config';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from '@types/express-serve-static-core';
import { MulterWrapper } from "../multer-wrapper";

export class FileRouter extends BaseRouter<FileController> {
    public router: Router = Router();
    public fileController = new FileController();
    public resource: string;

    public constructor() {
        super();
        this.resource = Constants.FilesEndpoint;
        super.controller = this.fileController;
    }

    public getRouter(): Router {
        this.router = super.getRouter();

        return this.router.use(new MulterWrapper().uploader.array('files'))
            .post(`${this.resource}/upload`, async (request: Request, response: Response, next: NextFunction) => {
                await this.controller.uploadFiles(request, response, next); //use the correct method here:
            });
    }
}