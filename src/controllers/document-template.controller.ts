import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import { DocumentTemplate, IDocumentTemplate } from '../models/document-template';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { ListOptions } from '../models/list-options';
import { BaseController } from "./base/base.controller";

export class DocumentTemplateController extends BaseController<DocumentTemplate> {
  public modelName: string = 'DocumentTemplate';
  documentTemplate = mongoose.model('DocumentTemplate');

  public async list(request: Request, response: Response): Promise<any> {
    const options: ListOptions = new ListOptions({}, (request.query.page > 0 ? request.query.page : 1) - 1, 30);
    const documentTemplates = await DocumentTemplate.list(options);
    response.json(documentTemplates);
  }

  public async single(request: Request, response: Response, next: NextFunction): Promise<any> {
    await DocumentTemplate.findById(super.getId(request), (err, docTemplate)=> {
      if (err) { next(err) }
      response.json(docTemplate);
    });
  }

  public async blank(request: Request, response: Response, next: NextFunction): Promise<any> {
    response.json(new DocumentTemplate());
  }

  public async count(request: Request, response: Response, next: NextFunction): Promise<any> {
    await DocumentTemplate.count({}, (error: any, count: Number)=> {
      if (error) { next(error) }
      response.json({
        CollectionName: DocumentTemplate.collection.name,
        CollectionCount: count
      });
    })
  }

  public async create(request: Request, response: Response, next: NextFunction) {
    const documentTemplate = new DocumentTemplate(request.body);
    await documentTemplate.save( (error: any, item: any, numberAffected: number)=> {
      if (error) { next(error) }
      response.json({ item });
    });
  }

  public async update(request: Request, response: Response, next: NextFunction) {
    await DocumentTemplate.findByIdAndUpdate(super.getId(request), new DocumentTemplate(request.body), { new: true }, (error: Error, createdItem) => {
      if (error) { next(error) }
      response.json(createdItem);
    });
  }
  public async destroy(request: Request, response: Response, next: NextFunction) {
    await DocumentTemplate.findByIdAndRemove(super.getId(request), (error, deletedItem) => {
      if (error) { next(error) }
      response.json({
        ItemRemovedId: super.getId(request),
        ItemRemoved: deletedItem
      });
    });
  }

  public async query(request: Request, response: Response, next: NextFunction) {
    await DocumentTemplate.find(request.body,(error: Error, items: IDocumentTemplate[])=>{
      if (error) { next(error) }
      response.json({ items });
    });
  }
}
