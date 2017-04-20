import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import { DocumentTemplateMI, IDocumentTemplate, DocumentTemplateModel } from '../models/document-template';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from "./base/base.controller";

export class DocumentTemplateController extends BaseController<IDocumentTemplate> {
  public defaultPopulationArgument = null;

  constructor() {
    super();
    super.mongooseSchemaInstance = DocumentTemplateMI;
  }
}
