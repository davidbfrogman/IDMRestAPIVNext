import { NextFunction, Request, RequestHandler, RequestParamHandler, Response, Router } from 'express';
import mongoose = require('mongoose');
import { Document, DocumentQuery, Model, Schema } from 'mongoose';
import { SearchCriteria } from '../../models/search-criteria';
import log = require('winston');

// Model<IUser> & IUser
// OLD WAY: BaseController<ModelType extends Document>
// export abstract class BaseController<T extends Document,XType extends Document & Model<T>>{
export abstract class BaseController<IModelMongooseComposite extends Document>{
  public mongooseModelInstance: Model<IModelMongooseComposite>;
  public searchCriteria: SearchCriteria;
  public abstract defaultPopulationArgument: object;

  public getId(request: Request): string {
    return request && request.params ? request.params['id'] : null;
  }

  public list(request: Request, response: Response, next: NextFunction): Promise<IModelMongooseComposite[]> {
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
        return listedItems;
      })
      .catch((error) => { next(error); });
  }

  public single(request: Request, response: Response, next: NextFunction): Promise<IModelMongooseComposite> {
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

  public create(request: Request, response: Response, next: NextFunction): Promise<IModelMongooseComposite> {
    return new this.mongooseModelInstance(request.body).save()
      .then((item: IModelMongooseComposite) => {

        response.json({ item });

        log.info(`Created New: ${this.mongooseModelInstance.collection.name}, ID: ${item._id}`);
        return item;
      })
      .catch((error) => { next(error); });
  }

  // For now update full/partial do exactly the same thing, whenever we want to break out
  // patch, we can do that.
  public updateFull(request: Request, response: Response, next: NextFunction): Promise<IModelMongooseComposite> {
    return this.update(request, response, next);
  }

  public updatePartial(request: Request, response: Response, next: NextFunction): Promise<IModelMongooseComposite> {
    return this.update(request, response, next);
  }

  private update(request: Request, response: Response, next: NextFunction): Promise<IModelMongooseComposite> {
    return this.mongooseModelInstance
      .findByIdAndUpdate(this.getId(request), new this.mongooseModelInstance(request.body), { new: false })
      .then((updatedItem: IModelMongooseComposite) => {
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

  public destroy(request: Request, response: Response, next: NextFunction): Promise<IModelMongooseComposite> {
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

  public query(request: Request, response: Response, next: NextFunction): Promise<IModelMongooseComposite[]> {
    let query = this.mongooseModelInstance.find(request.body);

    query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

    return query.then((items: IModelMongooseComposite[]) => {

      response.json({ items });

      log.info(`Queried for: ${this.mongooseModelInstance.collection.name}, Found: ${items.length}`);
      return items;
    })
      .catch((error) => { next(error); });
  }
}
