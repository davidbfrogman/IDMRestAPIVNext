import { NextFunction, Request, RequestHandler, RequestParamHandler, Response, Router } from 'express';
import { FileComposite, IFileComposite, IFile } from '../models/file';
import { BaseController } from './base/base.controller';
import { Constants } from "../constants";
import { exchange } from "../config/queue";
import { Config } from '../config/config';
import * as log from 'winston';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { ProcessingState } from "../enumerations";
import * as multerTypes from '../customTypes/multer.index';

// var Promise = require("bluebird");

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
        exchange.publish(file, { key: Constants.IDMImageProcessorQ });
        response.json({
            message: "We just published a message on the queue"
        });
    }



    public uploadFiles(request: Request, response: Response, next: NextFunction): void {
        //this is using custom types that actually match the field name in postman.
        let files = request.files;
        let savedFileDocuments = new Array<IFileComposite>();
        let savePromises = new Array<Promise<IFileComposite>>();
        files.map((uploadedFile) => {
            let databaseFile: IFileComposite = new FileComposite();
            databaseFile.originalName = uploadedFile.originalname;
            databaseFile.fileName = uploadedFile.filename;
            databaseFile.location = uploadedFile.destination;
            databaseFile.size = uploadedFile.size;
            databaseFile.mimeType = uploadedFile.mimetype;
            databaseFile.encoding = uploadedFile.encoding;
            databaseFile.processingState = ProcessingState.Uploaded;
            databaseFile.isDoneProcessing = false;

            //insert into database
            let savePromise = databaseFile.save()
                .then((savedFile: IFileComposite) => {
                    savedFileDocuments.push(savedFile);
                    log.info(`Created New: ${this.mongooseModelInstance.collection.name}, ID: ${savedFile._id}`);
                    return savedFile;
                }).catch((error) => { next(error) });
            savePromises.push(savePromise);

        });

        Promise.all(savePromises).then((files: Array<IFileComposite>) => {
            //push message onto queue
            try {
                files.map((file) => {
                    exchange.publish(file, { key: Constants.IDMImageProcessorQ });
                });

                response.status(201).json({ files });
            }
            catch (error) {
                next(error);
            }
        })
    }
}