import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { SearchCriteria } from "./search-criteria";
import log = require('winston');

export abstract class BaseController<ModelType extends Document>{
    mongooseSchemaInstance: Model<ModelType>;
    searchCriteria: SearchCriteria;

    public constructor() {
    }

    public getId(request: Request): string {
        return request && request.params ? request.params['id'] : null;
    }

    public async list(request: Request, response: Response, next: NextFunction): Promise<any> {
        this.searchCriteria = new SearchCriteria(request, next);

        var query = this.mongooseSchemaInstance
            .find(this.searchCriteria.criteria)
            .skip(this.searchCriteria.skip)
            .limit(this.searchCriteria.limit)
            .sort(this.searchCriteria.sort);

        await query.exec((error: Error, listedItems: ModelType[]) => {
            if (error) { next(error); return; }
            
            response.json(listedItems);
            log.info(`Executed List Operation: ${this.mongooseSchemaInstance.collection.name}, Count: ${listedItems.length}`);
        });
    }

    public async single(request: Request, response: Response, next: NextFunction): Promise<any> {
        await this.mongooseSchemaInstance.findById(this.getId(request), (error, item) => {
            if (error) { next(error); return; }

            response.json(item);
            log.info(`Executed Single Operation: ${this.mongooseSchemaInstance.collection.name}, item._id: ${item._id}`);
        });
    }

    public async blank(request: Request, response: Response, next: NextFunction): Promise<any> {
        response.json(new this.mongooseSchemaInstance());
    }

    public async count(request: Request, response: Response, next: NextFunction): Promise<any> {
        this.searchCriteria = new SearchCriteria(request, next);

        var query = this.mongooseSchemaInstance
            .find(this.searchCriteria.criteria)

        await query.count({}, (error: any, count: Number) => {
            if (error) { next(error); return; }

            response.json({
                CollectionName: this.mongooseSchemaInstance.collection.name,
                CollectionCount: count,
                SearchCriteria: this.searchCriteria.criteria
            });
            log.info(`Executed Count Operation: ${this.mongooseSchemaInstance.collection.name}, Count: ${count}`);
        })
    }

    public async create(request: Request, response: Response, next: NextFunction) {
        const documentTemplate = new this.mongooseSchemaInstance(request.body);
        await documentTemplate.save((error: any, item: ModelType, numberAffected: number) => {
            if (error) { next(error); return; }

            response.json({ item });
            log.info(`Created New: ${this.mongooseSchemaInstance.collection.name}, ID: ${item._id}`);
        });
    }

    public async update(request: Request, response: Response, next: NextFunction) {
        await this.mongooseSchemaInstance.findByIdAndUpdate(
            this.getId(request),
            new this.mongooseSchemaInstance(request.body), { new: true }, (error: Error, createdItem: ModelType) => {
                if (error) { next(error); return; }

                response.json(createdItem);
                log.info(`Updated An: ${this.mongooseSchemaInstance.collection.name}, ID: ${createdItem._id}`);
            });
    }
    public async destroy(request: Request, response: Response, next: NextFunction) {
        await this.mongooseSchemaInstance.findByIdAndRemove(this.getId(request), (error, deletedItem) => {
            if (error) { next(error); return; }

            response.json({
                ItemRemovedId: this.getId(request),
                ItemRemoved: deletedItem
            });
            log.info(`Removed An: ${this.mongooseSchemaInstance.collection.name}, ID: ${this.getId(request)}`);
        });
    }
    public async query(request: Request, response: Response, next: NextFunction) {
        await this.mongooseSchemaInstance.find(request.body, (error: Error, items: ModelType[]) => {
            if (error) { next(error); return; }

            response.json({ items });
            log.info(`Queried for: ${this.mongooseSchemaInstance.collection.name}, Found: ${items.length}`);
        });
    }
}