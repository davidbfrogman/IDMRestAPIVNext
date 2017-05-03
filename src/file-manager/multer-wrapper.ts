import { Router } from 'express';
import { FileController } from '../controllers/file.controller';
import { Constants } from "../constants";
import { Config } from '../config/config';
import { Request, Response, RequestHandler, } from 'express';
import { RequestHandlerParams, NextFunction } from '@types/express-serve-static-core';
import * as crypto from 'crypto';
import * as mime from 'mime';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import * as log from 'winston';
import * as multerTypes from '../customTypes/multer.index';

export class MulterWrapper{
    public constructor(){
        this.ensureUploadFolderExists();
    }

    public storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `${Config.currentConfig().FileUploadPath}`)
        },
        filename: this.fileName
    });

    public uploader = multer({
        storage: this.storage,
        fileFilter: this.fileFilter,
        limits: {
            fileSize : 200000000, //200mb limit on filesize, this number is in bytes
            files: 30 //maximum  of 30 files at a time
        },
        preservePath: false,
    });

    public ensureUploadFolderExists(){
        var dir = Config.currentConfig().FileUploadPath;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }

    public fileName(req, file, cb) {
        crypto.pseudoRandomBytes(16, (err, raw) => {
            let fileName: string = file.originalname;
            // I'm slicing off the extention, so that the image name is easier to read, although this might
            // lead to problems later, if for some reason there is a file named 'a.y'
            cb(null,`${fileName.slice(0,-4)}-${raw.toString('hex')}-${Date.now()}.${mime.extension(file.mimetype)}`);
        });
    }

    public fileFilter(req, file, cb) {
        // accept image only
        // TODO: figure out what file types are accepted
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|pdf|doc|xls|)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}