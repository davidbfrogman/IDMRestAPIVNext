import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IField, FieldSchema } from './field'


export interface IDocumentTemplate extends Document {
    name: string
    description?: string;
    fields: Array<IField>;
    createdAt?: Date; //Automatically created by mongoose.
    modifiedAt?: Date; //Automatically created by mongoose.
}

export const DocumentTemplateSchema = new Schema({
    name: { type: String },
    description: { type: String },
    fields:[FieldSchema],
},{timestamps:true});

DocumentTemplateSchema.pre('save',function(next){
    //If there's any validators, this field requires validation.
    next();
});

export type DocumentTemplateModel = Model<IDocumentTemplate> & IDocumentTemplate;

export const DocumentTemplateMI: DocumentTemplateModel = <DocumentTemplateModel>mongoose.model<IDocumentTemplate>('DocumentTemplate', DocumentTemplateSchema);