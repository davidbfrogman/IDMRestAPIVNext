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
import { mongoose } from "../config/database";
import * as mongooseSchema from 'mongoose';

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
        // this is using custom types that actually match the field name in postman.
        let files = request.files;
        let saveFilePromises = new Array<Promise<IFileComposite>>();
        let saveResourcePromises = new Array<Promise<IResourceComposite>>();
        files.forEach((uploadedFile) => {
            let databaseFile = this.buildFileFromRequest(request);

            let databaseResource: IResourceComposite = this.buildResourceFromRequest(request, uploadedFile);

            saveResourcePromises.push(databaseResource.save().then((savedResource) => {
                databaseFile.resources.push(savedResource);

                //insert into database
                saveFilePromises.push(databaseFile.save()
                    .then((savedFile: IFileComposite) => {
                        log.info(`Created New: ${this.mongooseModelInstance.collection.name}, ID: ${savedFile._id}`);
                        return savedFile;
                    }).catch((error) => { next(error) }));

                return savedResource;
            }).catch((error) => { next(error) }));
        });

        Promise.all(saveResourcePromises).then((savedResources) => {
            Promise.all(saveFilePromises).then((files: Array<IFileComposite>) => {
                // push message onto queue
                try {
                    let fileIds = new Array<any>();
                    files.forEach((file) => {
                        exchange.publish(file, { key: Constants.IDMImageProcessorQ });
                        fileIds.push(file._id);
                    });

                    FileComposite.find({ _id: { $in: fileIds } }).populate('resources').exec().then((files) => {
                        response.status(201).json({ files });
                    }).catch((error) => { next(error) });
                }
                catch (error) {
                    next(error);
                }
            });
        });
    }

    public buildFileFromRequest(request: Request): IFileComposite {
        let databaseFile: IFileComposite = new FileComposite();

        databaseFile.processingState = ProcessingState.Uploaded;
        databaseFile.isDoneProcessing = false;
        
        return databaseFile;
    }

    public buildResourceFromRequest(request: Request, uploadedFile: Express.Multer.File): IResourceComposite {
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

        return databaseResource;
    }
}