import { Document, Model, Schema } from 'mongoose';
import { mongoose } from '../config/database';
import { FieldSchema, IField } from './field'
import { IEnterpriseEnumeration } from "./enterprise-enumeration";

export interface IDocumentTemplate extends Document {
    name: string
    description?: string;
    fields: IField[];
    enterpriseEnumeration: IEnterpriseEnumeration[];
    version: number;
    createdAt?: Date; // Automatically created by mongoose.
    modifiedAt?: Date; // Automatically created by mongoose.
}

export const DocumentTemplateSchema = new Schema({
    name: { type: String },
    description: { type: String },
    version:{type:Number, default:0},
    enumerations: [{ type : Schema.Types.ObjectId, ref: 'enterpriseEnumeration' }],
    fields:[FieldSchema],
},{timestamps:true});

// If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
// tslint:disable-next-line:only-arrow-functions
DocumentTemplateSchema.pre('save',function (next){
    next();
});

// If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
DocumentTemplateSchema.pre('update',function (next){
    // If there's any validators, this field requires validation.
    // TODO: Pull the version from the db, remember update could be only a partial doc template;
    this.version = this.version ? this.version++ : null;
    next();
});

export interface IDocumentTemplateComposite extends IDocumentTemplate, Document {};

// tslint:disable-next-line:variable-name
export const DocumentTemplateComposite: Model<IDocumentTemplateComposite>
    = mongoose.model<IDocumentTemplateComposite>('documentTemplate', DocumentTemplateSchema);
