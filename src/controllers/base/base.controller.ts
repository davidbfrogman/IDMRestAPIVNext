import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';

export abstract class BaseController<ModelType extends Document>{

  mongooseSchemaInstance: Model<ModelType>;

  public constructor() {
  }

  public getId(request: Request): string {
    return request && request.params ? request.params['id'] : null;
  }

  public async list(request: Request, response: Response, next: NextFunction): Promise<any> {
    await this.mongooseSchemaInstance.find((error: Error, listedItems: ModelType[]) => {
      if (error) { next(error) }
      response.json(listedItems);
    });
  }

  public async single(request: Request, response: Response, next: NextFunction): Promise<any> {
    await this.mongooseSchemaInstance.findById(this.getId(request), (err, item) => {
      if (err) { next(err) }
      response.json(item);
    });
  }

  public async blank(request: Request, response: Response, next: NextFunction): Promise<any> {
    response.json(new this.mongooseSchemaInstance());
  }

  public async count(request: Request, response: Response, next: NextFunction): Promise<any> {
    await this.mongooseSchemaInstance.count({}, (error: any, count: Number) => {
      if (error) { next(error) }
      response.json({
        CollectionName: this.mongooseSchemaInstance.collection.name,
        CollectionCount: count
      });
    })
  }

  public async create(request: Request, response: Response, next: NextFunction) {
    const documentTemplate = new this.mongooseSchemaInstance(request.body);
    await documentTemplate.save((error: any, item: any, numberAffected: number) => {
      if (error) { next(error) }
      response.json({ item });
    });
  }

  public async update(request: Request, response: Response, next: NextFunction) {
    await this.mongooseSchemaInstance.findByIdAndUpdate(this.getId(request), new this.mongooseSchemaInstance(request.body), { new: true }, (error: Error, createdItem) => {
      if (error) { next(error) }
      response.json(createdItem);
    });
  }
  public async destroy(request: Request, response: Response, next: NextFunction) {
    await this.mongooseSchemaInstance.findByIdAndRemove(this.getId(request), (error, deletedItem) => {
      if (error) { next(error) }
      response.json({
        ItemRemovedId: this.getId(request),
        ItemRemoved: deletedItem
      });
    });
  }

  public async query(request: Request, response: Response, next: NextFunction) {
    await this.mongooseSchemaInstance.find(request.body, (error: Error, items: ModelType[]) => {
      if (error) { next(error) }
      response.json({ items });
    });
  }
}