import { NextFunction, Request, RequestHandler, RequestParamHandler, Response, Router } from 'express';
import { FileComposite, IFileComposite, IFile } from '../models/file';
import { BaseController } from './base/base.controller';
import { Constants } from "../constants";
import { exchange } from "../config/queue";
var Promise = require("bluebird");

export class FileController extends BaseController<IFileComposite> {
    public defaultPopulationArgument = null;

    constructor() {
        super();
        super.mongooseModelInstance = FileComposite;
    }

    public utility(request: Request, response: Response, next: NextFunction): void {
        let file = new FileComposite();
        file.name = "DavesTest File";
        file.location = "/files/";
        file.fileName = "test.jpg";

        //publish message 
        exchange.publish(file, { key: Constants.IDMFileProcessorQ });
        response.json({
            message: "We just published a message on the queue"
        });
    }
}
