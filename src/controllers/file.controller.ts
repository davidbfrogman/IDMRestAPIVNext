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
import { ProcessingState, ResourceType } from "../enumerations";
import * as multerTypes from '../customTypes/multer.index';
import { ResourceComposite, IResourceComposite } from "../models/resource";

// var Promise = require("bluebird");

export class FileController extends BaseController<IFileComposite> {
    public defaultPopulationArgument = {
        path: 'resources'
    };

    constructor() {
        super();
        super.mongooseModelInstance = FileComposite;
    }

    public utility(request: Request, response: Response, next: NextFunction): void {
    }



    public uploadFiles(request: Request, response: Response, next: NextFunction): void {
        //this is using custom types that actually match the field name in postman.
        let files = request.files;
        let savedFileDocuments = new Array<IFileComposite>();
        let savePromises = new Array<Promise<IFileComposite>>();
        files.map((uploadedFile) => {
            let databaseFile: IFileComposite = new FileComposite();

            databaseFile.processingState = ProcessingState.Uploaded;
            databaseFile.isDoneProcessing = false;

            let databaseResource: IResourceComposite = new ResourceComposite();

            databaseResource.originalName = uploadedFile.originalname;
            databaseResource.fileName = uploadedFile.filename;
            databaseResource.location = uploadedFile.destination;
            databaseResource.size = uploadedFile.size;
            databaseResource.mimeType = uploadedFile.mimetype;
            databaseResource.encoding = uploadedFile.encoding;
            databaseResource.isDoneProcessing = false;
            databaseResource.resourceType = ResourceType.original;
            databaseResource.processingState = ProcessingState.Uploaded;

            databaseResource.save().then((savedResource) => {
                databaseFile.resources.push(savedResource);

                //insert into database
                let savePromise = databaseFile.save()
                    .then((savedFile: IFileComposite) => {
                        savedFileDocuments.push(savedFile);
                        log.info(`Created New: ${this.mongooseModelInstance.collection.name}, ID: ${savedFile._id}`);
                        return savedFile;
                    }).catch((error) => { next(error) });
                savePromises.push(savePromise);
            })
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