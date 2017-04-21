import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { SearchCriteria } from "../../models/search-criteria";
import log = require('winston');

//Model<IUser> & IUser
//OLD WAY: BaseController<ModelType extends Document>
//export abstract class BaseController<T extends Document,XType extends Document & Model<T>>{
export abstract class BaseController<IModelMongooseComposite extends Document>{
  public mongooseModelInstance: Model<IModelMongooseComposite>;
  searchCriteria: SearchCriteria;
  abstract defaultPopulationArgument: Object;

  public constructor() {
  }

  public getId(request: Request): string {
    return request && request.params ? request.params['id'] : null;
  }

  public list(request: Request, response: Response, next: NextFunction): Promise<any> {
    this.searchCriteria = new SearchCriteria(request, next);

    let query = this.mongooseModelInstance.find()
      .skip(this.searchCriteria.skip)
      .limit(this.searchCriteria.limit)
      .sort(this.searchCriteria.sort);

    query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

    return query.exec()
      .then((listedItems: IModelMongooseComposite[]) => {

        response.json(listedItems);

        log.info(`Executed List Operation: ${this.mongooseModelInstance.collection.name}, Count: ${listedItems.length}`);
      })
      .catch((error) => { next(error); });
  }

  public single(request: Request, response: Response, next: NextFunction): Promise<any> {
    let query = this.mongooseModelInstance
      .findById(this.getId(request))

    query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

    return query.then((item) => {

      response.json(item);

      log.info(`Executed Single Operation: ${this.mongooseModelInstance.collection.name}, item._id: ${item._id}`);
    })
      .catch((error) => { next(error); });
  }

  public blank(request: Request, response: Response, next: NextFunction): void {
    response.json(new this.mongooseModelInstance());
  }

  public count(request: Request, response: Response, next: NextFunction): Promise<any> {
    this.searchCriteria = new SearchCriteria(request, next);
    return this.mongooseModelInstance
      .find(this.searchCriteria.criteria)
      .count()
      .then((count: Number) => {

        response.json({
          CollectionName: this.mongooseModelInstance.collection.name,
          CollectionCount: count,
          SearchCriteria: this.searchCriteria.criteria
        });

        log.info(`Executed Count Operation: ${this.mongooseModelInstance.collection.name}, Count: ${count}`);
      })
      .catch((error) => { next(error); });
  }

  public create(request: Request, response: Response, next: NextFunction): Promise<any> {
    return new this.mongooseModelInstance(request.body).save()
      .then((item: IModelMongooseComposite) => {

        response.json({ item });

        log.info(`Created New: ${this.mongooseModelInstance.collection.name}, ID: ${item._id}`);
      })
      .catch((error) => { next(error); });
  }

  public update(request: Request, response: Response, next: NextFunction): Promise<any> {

    return this.mongooseModelInstance
      .findByIdAndUpdate(this.getId(request), new this.mongooseModelInstance(request.body), { new: true })
      .then((createdItem: IModelMongooseComposite) => {

        response.json(createdItem);

        log.info(`Updated a: ${this.mongooseModelInstance.collection.name}, ID: ${createdItem._id}`);
      })
      .catch((error) => { next(error); });
  }

  public destroy(request: Request, response: Response, next: NextFunction): Promise<any> {
    let query = this.mongooseModelInstance
      .findByIdAndRemove(this.getId(request));

    query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

    return query.then((deletedItem) => {

        response.json({
          ItemRemovedId: this.getId(request),
          ItemRemoved: deletedItem
        });

        log.info(`Removed a: ${this.mongooseModelInstance.collection.name}, ID: ${this.getId(request)}`);
      })
      .catch((error) => { next(error); });
  }

  public query(request: Request, response: Response, next: NextFunction): Promise<any> {
    let query = this.mongooseModelInstance.find(request.body)
    
     query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

     return query.then((items: IModelMongooseComposite[]) => {

        response.json({ items });

        log.info(`Queried for: ${this.mongooseModelInstance.collection.name}, Found: ${items.length}`);
      })
      .catch((error) => { next(error); });
  }
}