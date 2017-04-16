import { mongoose } from "../config/database";
import { Schema, Model, Document } from "mongoose";
import {ListOptions} from './list-options';

export interface IDocumentTemplate extends Document {
    name: string
    createdOn?: Date;
    modifiedOn?: Date;
    description?: string;
    updateDescription(id: {}, description: string): Promise<{ nModified: number }>;
    load(id: {}): Promise<IDocumentTemplate>;
    list(options: ListOptions): Promise<IDocumentTemplate[]>;
}

const schema = new Schema({
    name: { type: String },
    createdOn: { type: Date, "default": Date.now },
    modifiedOn: { type: Date, },
    description: { type: String }
});

schema.pre('save',(next)=>{
    if(this.modifiedOn){
        this.modifiedOn = new Date();
    }
    next();
});

schema.static("updateDescription", (documentTemplateId: {}, description: string) => {
    return DocumentTemplate.update(
        { "_id": documentTemplateId },
        {
            "$set": {
                "description": description,
                "modifiedOn": Date.now
            }
        })
        .exec();
});

schema.static("load", (documentTemplateId: {}) => {
    return DocumentTemplate.findOne({ "_id": documentTemplateId }).exec();
});

schema.static("list", (options: ListOptions) => {
    const criteria = options.criteria;
    const page = options.page;
    const limit = options.limit;
    return DocumentTemplate.find(criteria)
      .limit(limit)
      .skip(limit * page)
      .exec();
});

export type DocumentTemplateModel = Model<IDocumentTemplate> & IDocumentTemplate;

export const DocumentTemplate: DocumentTemplateModel = <DocumentTemplateModel>mongoose.model<IDocumentTemplate>("DocumentTemplate", schema);