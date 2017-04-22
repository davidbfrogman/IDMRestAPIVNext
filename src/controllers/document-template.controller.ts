import { NextFunction, Request, RequestHandler, RequestParamHandler, Response, Router } from 'express';
import { DocumentTemplateComposite, IDocumentTemplateComposite } from '../models/document-template';
import mongoose = require('mongoose');
import { Document, Model, Schema } from 'mongoose';
import { BaseController } from './base/base.controller';

export class DocumentTemplateController extends BaseController<IDocumentTemplateComposite> {
  public defaultPopulationArgument = null;

  constructor() {
    super();
    super.mongooseModelInstance = DocumentTemplateComposite;
  }
}
