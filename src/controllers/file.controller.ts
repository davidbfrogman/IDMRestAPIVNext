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
        exchange.publish(file, { key: Constants.IDMFileProcessorQ });
        response.json({
            message: "We just published a message on the queue"
        });
    }



    public uploadFiles(request: Request, response: Response, next: NextFunction): void {
        //had to change the multer types file.... I have a feeling it might just be easier to delete the types.
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
            files.map((file) => {
                exchange.publish(file, { key: Constants.IDMFileProcessorQ });
            });

            response.status(201).json({ files });
        })
    }
    // filesArray = <Multer.Request.Files>request.files;
    // log.info(`Files Length: ${request.files.length}`);
    // for (var index = 0; index < request.files.length; index++) {
    //     var uploadedFile = request.files[index];
    //     let file: IFileComposite = {
    //         name: uploadedFile.name;
    //         encoding:
    //     }
    //     file.name = request.files[0].fileName;
    //     file.location = "/files/";
    //     file.fileName = "test.jpg";
    // }
}
export interface MulterFile {
                /** Name of the file on the user's computer */
                originalname: string;
                /** Encoding type of the file */
                encoding: string;
                /** Mime type of the file */
                mimetype: string;
                /** Size of the file in bytes */
                size: number;
                /** The folder to which the file has been saved (DiskStorage) */
                destination: string;
                /** The name of the file within the destination (DiskStorage) */
                filename: string;
                /** Location of the uploaded file (DiskStorage) */
                path: string;
                /** A Buffer of the entire file (MemoryStorage) */
                buffer: Buffer;
            }