import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import { IDocumentTemplateMongooseComposite, DocumentTemplateMongooseComposite } from '../models/document-template';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from "./base/base.controller";

export class DocumentTemplateController extends BaseController<IDocumentTemplateMongooseComposite> {
  public defaultPopulationArgument = null;

  constructor() {
    super();
    super.mongooseModelInstance = DocumentTemplateMongooseComposite;
  }
}
