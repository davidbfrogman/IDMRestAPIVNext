import { NextFunction, Request, RequestHandler, RequestParamHandler, Response, Router } from 'express';
import { Document, DocumentQuery, Model, Schema } from 'mongoose';
import { SearchCriteria } from '../../models/search-criteria';
import * as log from 'winston';
import { IValidationError } from "../../models/validation-error";
import { BulkUpdateSummary } from "../../bulk-update-summary";
import { ObjectId } from "@types/bson";
var Promise = require("bluebird");

export abstract class BaseController<IMongooseDocument extends Document>{
  public mongooseModelInstance: Model<IMongooseDocument>;
  public searchCriteria: SearchCriteria;
  public abstract defaultPopulationArgument: object;

  public isValid(model: IMongooseDocument): IValidationError[] {
    return null;
  };

  public preCreateHook(model: IMongooseDocument): Promise<IMongooseDocument> {
    return Promise.resolve(model);
  }

  public preUpdateHook(model: IMongooseDocument, request: Request): Promise<IMongooseDocument> {
    return Promise.resolve(model);
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

    return query.then((listedItems: IMongooseDocument[]) => {
      response.json(listedItems);

      log.info(`Executed List Operation: ${this.mongooseModelInstance.collection.name}, Count: ${listedItems.length}`);

      return listedItems;

    }).catch((error) => { next(error); });
  }

  public single(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument> {

    let query = this.mongooseModelInstance
      .findById(this.getId(request));

    query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

    return query.then((item) => {
      if (!item) { throw ({ message: 'Item Not Found', status: 404 }) }

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
    return this.preCreateHook(new this.mongooseModelInstance(request.body)).then((itemAfterPreCreateHook) => {

      let validationErrors = this.isValid(itemAfterPreCreateHook);

      if (validationErrors && validationErrors.length > 0) {
        this.respondWithValidationErrors(request, response, next, validationErrors);
        return null;
      }

      itemAfterPreCreateHook.save()
        .then((savedItem: IMongooseDocument) => {

          response.status(201).json({ savedItem });

          log.info(`Created New: ${this.mongooseModelInstance.collection.name}, ID: ${savedItem._id}`);
          return savedItem;
        })
        .catch((error) => { next(error); });
    })
      .catch((error) => { next(error); });
  }

  // For now update full/partial do exactly the same thing, whenever we want to break out
  // patch, we can do that.
  public updateFull(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument> {
    return this.update(request, response, next,true);
  }

  public updatePartial(request: Request, response: Response, next: NextFunction): Promise<IMongooseDocument> {
    return this.update(request, response, next,false);
  }

  private update(request: Request, response: Response, next: NextFunction, isFull: boolean): Promise<IMongooseDocument> {
    return this.preUpdateHook(new this.mongooseModelInstance(request.body), request)
      .then((itemAfterUpdateHook) => {
        let validationErrors = this.isValid(itemAfterUpdateHook);
        if (validationErrors && validationErrors.length > 0) {
          this.respondWithValidationErrors(request, response, next, validationErrors);
          return null;
        }

        // notice that we're using the request body in the set operation NOT the item after the pre update hook.
        let updateBody: any;
        if (isFull) {
          // here we have a full document, so we don't need the set operation
          updateBody = itemAfterUpdateHook; 
        }
        else {
          // here someone only passed in a few fields, so we use the set operation to only change the fields that were passed in.
          updateBody = { $set: request.body }
        }

        this.mongooseModelInstance
          // new:true means to return the newly updated object. (nothing to do with creating a new item)
          .findByIdAndUpdate(this.getId(request), updateBody, { new: true })
          .then((updatedItem: IMongooseDocument) => {
            if (!updatedItem) {
              let error = new Error('Item Not Found');
              error['status'] = 404;
              throw (error);
            }

            response.status(202).json(updatedItem);

            log.info(`Updated a: ${this.mongooseModelInstance.collection.name}, ID: ${updatedItem._id}`);
            return updatedItem;
          })
          .catch((error) => {
            next(error);
          });
      })
      .catch((error) => {
        next(error);
      });
  }

  // We need to seperate the put body into 2 parts.
  // The put body will contain a query property, and a updateDocument property which will contain the fields to update.
  // First we find the documents. 
  // TODO this isn't quite right, because if we just update the fields, we're not actually 
  // running all the validation logic we need to.  Really we need to 
  // 1. get the document before update
  // 2. apply the updates
  // 3. run the validation
  // 4. if validation passes, do a real update to the db.
  // 5. if validation fails return validation failures.
  public bulkUpdate(request: Request, response: Response, next: NextFunction): Promise<BulkUpdateSummary> {

    let bulkUpdateSummary: BulkUpdateSummary = {
      totalItemsUpdated: 0,
      validationErrors: new Array<IValidationError>(),
      itemIdsUpdated: new Array<ObjectId>(),
      itemIdsFailed: new Array<ObjectId>()
    }

    if (request.body['query'] && request.body['updateDocument']) {

      return this.mongooseModelInstance.find(request.body['query']).then((items) => {

        for (var index = 0; index < items.length; index++) {
          var item = items[index];
          item._id
          this.preUpdateHook(item, request.body['updateDocument']).then((itemAfterUpdateHook) => {

            let validationErrors = this.isValid(itemAfterUpdateHook);
            if (validationErrors && validationErrors.length > 0) {
              bulkUpdateSummary.validationErrors = bulkUpdateSummary.validationErrors.concat(validationErrors);
              bulkUpdateSummary.itemIdsFailed.push(itemAfterUpdateHook._id);
            }
            else {
              this.mongooseModelInstance.findByIdAndUpdate(item._id, itemAfterUpdateHook).then((updatedItem) => {

                bulkUpdateSummary.totalItemsUpdated = bulkUpdateSummary.totalItemsUpdated++;
                bulkUpdateSummary.itemIdsUpdated.push(itemAfterUpdateHook._id);

              }).catch((error) => {
                next(error);
              });
            }
          }).catch((error) => {
            next(error);
          });
        }
        response.status(202).json(bulkUpdateSummary);

        log.info(`Bulk Update Command Issued on: ${this.mongooseModelInstance.collection.name}, 
                  Validation Error Count: ${bulkUpdateSummary.validationErrors ? bulkUpdateSummary.validationErrors.length : 0}
                  Total Items Updated Count:  ${bulkUpdateSummary.totalItemsUpdated}`);

        return bulkUpdateSummary;
      }).catch((error) => {
        next(error);
      });
    }
    else {
      next(new Error('Both a query, and a updateDocument are required for a bulk update operation'));
    }
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
    this.recursivlyConvertRegexes(request.body)
    let query = this.mongooseModelInstance.find(request.body);
    //query.find({"fields": { "$elemMatch": { "name": "Invoice Name", "stringValue": { $regex: /ax/i, $options:"i" }  }}});
    //let query = this.mongooseModelInstance.find({"description": { "$regex":  new RegExp('new','i') }}); 

    query = this.defaultPopulationArgument ? query.populate(this.defaultPopulationArgument) : query;

    return query.then((items: IMongooseDocument[]) => {

      response.json(items);

      log.info(`Queried for: ${this.mongooseModelInstance.collection.name}, Found: ${items.length}`);
      return items;
    })
      .catch((error) => { next(error); });
  }

  public respondWithValidationErrors(request: Request, response: Response, next: NextFunction, validationErrors: IValidationError[]): void {
    response.status(412).json({
      ValidationError: "Your Item did not pass validation",
      ValidationErrors: validationErrors
    });
  }

  public recursivlyConvertRegexes(requestBody: any) {
    if (requestBody instanceof Array) {
      for (var i = 0; i < requestBody.length; ++i) {
        this.recursivlyConvertRegexes(requestBody[i])
      }
    }
    let keysArray = Object.keys(requestBody);
    for (var index = 0; index < keysArray.length; index++) {
      var currentKey = keysArray[index];
      var element = requestBody[currentKey];
      if ((element instanceof Object || element instanceof Array) && Object.keys(element).length > 0) {
        this.recursivlyConvertRegexes(element);
      }
      else {
        if (currentKey === "$regex") {
          requestBody[currentKey] = new RegExp(requestBody[currentKey], 'i');
          return;
        }
      }
    }
  }
}