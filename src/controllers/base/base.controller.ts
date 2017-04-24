import { NextFunction, Request, RequestHandler, RequestParamHandler, Response, Router } from 'express';
import { Document, DocumentQuery, Model, Schema } from 'mongoose';
import { SearchCriteria } from '../../models/search-criteria';
import log = require('winston');
import { ValidationError } from "../../models/validation-error";

export abstract class BaseController<IMongooseDocument extends Document>{
  public mongooseModelInstance: Model<IMongooseDocument>;
  public searchCriteria: SearchCriteria;
  public abstract defaultPopulationArgument: object;

  public isValid(model: IMongooseDocument): ValidationError[] {
    return null;
  };

  public preCreateHook(model: IMongooseDocument): IMongooseDocument {
    return model;
  }

  public preUpdateHook(model: IMongooseDocument): IMongooseDocument {
    return model;
  }

  public preListHook(models: IMongooseDocument[]): IMongooseDocument[] {
    return models;
  }

  public getId(request: Request): string {
    return request && request.params ? request.params['id'] : null;
  }

  public list(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument[]> {
    this.searchCriteria = new SearchCriteria(request, next);

    let query = this.mongooseModelInstance.find()
      .skip(this.searchCriteria.skip)
      .limit(this.searchCriteria.limit)
      .sort(this.searchCriteria.sort);

    query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

    return query.exec()
      .then((listedItems: IMongooseDocument[]) => {
        listedItems = this.preListHook(listedItems);
        response.json(listedItems);

        log.info(`Executed List Operation: ${this.mongooseModelInstance.collection.name}, Count: ${listedItems.length}`);
        return listedItems;
      })
      .catch((error) => { next(error); });
  }

  public single(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument> {

    let query = this.mongooseModelInstance
      .findById(this.getId(request));

    query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

    return query.then((item) => {
      if (!item) {
        let error = new Error('Item Not Found');
        error['status'] = 404;
        throw (error);
      }

      response.json(item);
      log.info(`Executed Single Operation: ${this.mongooseModelInstance.collection.name}, item._id: ${item._id}`);
      return item;
    })
      .catch((error) => { next(error); });
  }

  public blank(request: Request, response: Response, next: NextFunction): void {
    response.json(new this.mongooseModelInstance());
  }

  public utility(request: Request, response: Response, next: NextFunction): void {
    response.json({});
  }

  public count(request: Request, response: Response, next: NextFunction): Promise<void> {
    this.searchCriteria = new SearchCriteria(request, next);
    return this.mongooseModelInstance
      .find(this.searchCriteria.criteria)
      .count()
      .then((count: number) => {

        response.json({
          CollectionName: this.mongooseModelInstance.collection.name,
          CollectionCount: count,
          SearchCriteria: this.searchCriteria.criteria,
        });

        log.info(`Executed Count Operation: ${this.mongooseModelInstance.collection.name}, Count: ${count}`);
      })
      .catch((error) => { next(error); });
  }

  public create(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument> {
    let modelInstance: IMongooseDocument = this.preCreateHook(new this.mongooseModelInstance(request.body));

    let validationErrors = this.isValid(modelInstance);
    if (validationErrors && validationErrors.length > 0) {
      this.respondWithValidationErrors(request, response, next, validationErrors);
      return null;
    }

    return modelInstance.save()
      .then((item: IMongooseDocument) => {

        response.json({ item });

        log.info(`Created New: ${this.mongooseModelInstance.collection.name}, ID: ${item._id}`);
        return item;
      })
      .catch((error) => { next(error); });
  }

  // For now update full/partial do exactly the same thing, whenever we want to break out
  // patch, we can do that.
  public updateFull(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument> {
    return this.update(request, response, next);
  }

  public updatePartial(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument> {
    return this.update(request, response, next);
  }

  private update(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument> {
    let modelInstance: IMongooseDocument = this.preUpdateHook(new this.mongooseModelInstance(request.body));

    let validationErrors = this.isValid(modelInstance);
    if (validationErrors && validationErrors.length > 0) {
      this.respondWithValidationErrors(request, response, next, validationErrors);
      return null;
    }

    return this.mongooseModelInstance
      .findByIdAndUpdate(this.getId(request), modelInstance, { new: false })
      .then((updatedItem: IMongooseDocument) => {
        if (!updatedItem) {
          let error = new Error('Item Not Found');
          error['status'] = 404;
          throw (error);
        }

        response.json(updatedItem);

        log.info(`Updated a: ${this.mongooseModelInstance.collection.name}, ID: ${updatedItem._id}`);
        return updatedItem;
      })
      .catch((error) => {
        next(error);
      });
  }

  public destroy(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument> {
    let query = this.mongooseModelInstance
      .findByIdAndRemove(this.getId(request));

    query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

    return query.then((deletedItem) => {
      if (!deletedItem) {
        let error = new Error('Item Not Found');
        error['status'] = 404;
        throw (error);
      }

      response.json({
        ItemRemovedId: this.getId(request),
        ItemRemoved: deletedItem,
      });

      log.info(`Removed a: ${this.mongooseModelInstance.collection.name}, ID: ${this.getId(request)}`);
      return deletedItem;
    })
      .catch((error) => { next(error); });
  }

  public clear(request: Request, response: Response, next: NextFunction): void {
    this.mongooseModelInstance.count(request.body).exec().then((count) => {
      let query = this.mongooseModelInstance.remove(request.body);

      query.then(() => {
        response.json({
          Collection: this.mongooseModelInstance.collection.name,
          Message: "All items cleared from collection",
          CountOfItemsRemoved: count
        });

        log.info(`Cleared the entire collection: ${this.mongooseModelInstance.collection.name}`);
      })
        .catch((error) => { next(error); });

    })
      .catch((error) => { next(error); });
  }

  public query(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument[]> {
    let query = this.mongooseModelInstance.find(request.body);

    query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

    return query.then((items: IMongooseDocument[]) => {

      response.json({ items });

      log.info(`Queried for: ${this.mongooseModelInstance.collection.name}, Found: ${items.length}`);
      return items;
    })
      .catch((error) => { next(error); });
  }

  public respondWithValidationErrors(request: Request, response: Response, next: NextFunction, validationErrors: ValidationError[]): void {
    response.json({
      ValidationError: "Your Item did not pass validation",
      ValidationErrors: validationErrors
    });
  }
}
