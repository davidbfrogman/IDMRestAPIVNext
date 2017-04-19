import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IField, FieldSchema } from './field'


export interface IDocumentTemplate extends Document {
    name: string
    description?: string;
    fields: Array<IField>;
    version: Number;
    createdAt?: Date; //Automatically created by mongoose.
    modifiedAt?: Date; //Automatically created by mongoose.
}

export const DocumentTemplateSchema = new Schema({
    name: { type: String },
    description: { type: String },
    version:{type:Number, default:0},
    fields:[FieldSchema],
},{timestamps:true});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
DocumentTemplateSchema.pre('save',function(next){
    next();
});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
DocumentTemplateSchema.pre('update',function(next){
    //If there's any validators, this field requires validation.
    //TODO: Pull the version from the db, remember update could be only a partial doc template;
    if(this.version){
        this.version = this.version++;
    }
    next();
});

export type DocumentTemplateModel = Model<IDocumentTemplate> & IDocumentTemplate;

export const DocumentTemplateMI: DocumentTemplateModel = <DocumentTemplateModel>mongoose.model<IDocumentTemplate>('DocumentTemplate', DocumentTemplateSchema);