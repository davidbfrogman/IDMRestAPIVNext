import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';

export interface IDocumentTemplate extends Document {
    name: string
    createdOn?: Date;
    modifiedOn?: Date;
    description?: string;
}

export const schema = new Schema({
    name: { type: String },
    createdOn: { type: Date, 'default': Date.now },
    modifiedOn: { type: Date, },
    description: { type: String }
});

schema.pre('save',(next)=>{
    if(this.modifiedOn){
        this.modifiedOn = new Date();
    }
    next();
});

export type DocumentTemplateModel = Model<IDocumentTemplate> & IDocumentTemplate;

export const DocumentTemplateMI: DocumentTemplateModel = <DocumentTemplateModel>mongoose.model<IDocumentTemplate>('DocumentTemplate', schema);