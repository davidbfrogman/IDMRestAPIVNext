import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';

export interface IDocumentTemplate extends Document {
    name: string
    createdAt?: Date; //Automatically created by mongoose.
    modifiedAt?: Date; //Automatically created by mongoose.
    description?: string;
    isVersioningEnabled: boolean;
    version: string;
}

export const schema = new Schema({
    name: { type: String },
    description: { type: String },
    isVersioningEnabled: {type: Boolean, required: true},
    version: {type: String}
},{timestamps:true});

schema.pre('save',(next)=>{
    // if(this.modifiedOn){
    //     this.modifiedOn = new Date();
    // }
    next();
});

export type DocumentTemplateModel = Model<IDocumentTemplate> & IDocumentTemplate;

export const DocumentTemplateMI: DocumentTemplateModel = <DocumentTemplateModel>mongoose.model<IDocumentTemplate>('DocumentTemplate', schema);