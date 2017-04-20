import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { SearchCriteria } from "../../models/search-criteria";
import log = require('winston');

export abstract class BaseController<ModelType extends Document>{
  mongooseSchemaInstance: Model<ModelType>;
  searchCriteria: SearchCriteria;
  abstract defaultPopulationArgument: Object;

  public constructor() {
  }

  public getId(request: Request): string {
    return request && request.params ? request.params['id'] : null;
  }

  public list(request: Request, response: Response, next: NextFunction): Promise<any> {
    this.searchCriteria = new SearchCriteria(request, next);

    var query = this.mongooseSchemaInstance
      .find(this.searchCriteria.criteria)
      .skip(this.searchCriteria.skip)
      .limit(this.searchCriteria.limit)
      .populate(this.defaultPopulationArgument)
      .sort(this.searchCriteria.sort);

    return query.exec()
      .then((listedItems: ModelType[]) => {

        response.json(listedItems);

        log.info(`Executed List Operation: ${this.mongooseSchemaInstance.collection.name}, Count: ${listedItems.length}`);
      })
      .catch((error) => { next(error); });
  }

  public single(request: Request, response: Response, next: NextFunction): Promise<any> {
    return this.mongooseSchemaInstance
      .findById(this.getId(request))
      .populate(this.defaultPopulationArgument)
      .then((item) => {

        response.json(item);

        log.info(`Executed Single Operation: ${this.mongooseSchemaInstance.collection.name}, item._id: ${item._id}`);
      })
      .catch((error) => { next(error); });
  }

  public blank(request: Request, response: Response, next: NextFunction): void {
    response.json(new this.mongooseSchemaInstance());
  }

  public count(request: Request, response: Response, next: NextFunction): Promise<any> {
    this.searchCriteria = new SearchCriteria(request, next);
    return this.mongooseSchemaInstance
      .find(this.searchCriteria.criteria)
      .count()
      .then((count: Number) => {

        response.json({
          CollectionName: this.mongooseSchemaInstance.collection.name,
          CollectionCount: count,
          SearchCriteria: this.searchCriteria.criteria
        });

        log.info(`Executed Count Operation: ${this.mongooseSchemaInstance.collection.name}, Count: ${count}`);
      })
      .catch((error) => { next(error); });
  }

  public create(request: Request, response: Response, next: NextFunction): Promise<any> {
    const documentTemplate = new this.mongooseSchemaInstance(request.body);
    return documentTemplate.save()
      .then((item: ModelType) => {

        response.json({ item });

        log.info(`Created New: ${this.mongooseSchemaInstance.collection.name}, ID: ${item._id}`);
      })
      .catch((error) => { next(error); });
  }

  public update(request: Request, response: Response, next: NextFunction): Promise<any> {
    
    return this.mongooseSchemaInstance
      .findByIdAndUpdate(this.getId(request), new this.mongooseSchemaInstance(request.body), { new: true })
      .populate(this.defaultPopulationArgument)
      .then((createdItem: ModelType) => {

        response.json(createdItem);

        log.info(`Updated a: ${this.mongooseSchemaInstance.collection.name}, ID: ${createdItem._id}`);
      })
      .catch((error) => { next(error); });
  }

  public destroy(request: Request, response: Response, next: NextFunction): Promise<any> {
    return this.mongooseSchemaInstance
      .findByIdAndRemove(this.getId(request))
      .populate(this.defaultPopulationArgument)
      .then((deletedItem) => {

        response.json({
          ItemRemovedId: this.getId(request),
          ItemRemoved: deletedItem
        });

        log.info(`Removed a: ${this.mongooseSchemaInstance.collection.name}, ID: ${this.getId(request)}`);
      })
      .catch((error) => { next(error); });
  }

  public query(request: Request, response: Response, next: NextFunction): Promise<any> {
    return this.mongooseSchemaInstance.find(request.body)
      .populate(this.defaultPopulationArgument)
      .then((items: ModelType[]) => {

        response.json({ items });

        log.info(`Queried for: ${this.mongooseSchemaInstance.collection.name}, Found: ${items.length}`);
      })
      .catch((error) => { next(error); });
  }
}