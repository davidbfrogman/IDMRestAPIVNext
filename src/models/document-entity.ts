import { Document, Model, Schema } from 'mongoose';
import { mongoose } from '../config/database';
import { FieldSchema, IField } from './field'
import { IEnterpriseEnumeration } from "./enterprise-enumeration";
import { IDataTable, DataTableSchema } from "./data-table";
import { ISelectedEnumeration, SelectedEnumerationSchema } from "./selected-enumeration";

export interface IDocumentEntity extends Document {
    name: string
    description?: string;
    fields: IField[];
    selectedEnumerations: ISelectedEnumeration[];
    version: number;
    isCheckedOut: boolean;
    checkedOutBy: string;
    checkedOutDate: Date;
    isTemplate: boolean;
    templateName: string;
    templateDescription: string;
    href: string;
    createdAt?: Date; // Automatically created by mongoose.
    modifiedAt?: Date; // Automatically created by mongoose.
    dataTables: IDataTable[];
}

export const DocumentEntitySchema = new Schema({
    name: { type: String },
    description: { type: String },
    version:{type:Number, default:0},
    isCheckedOut:{type: Boolean, required:true, default: false},
    checkedOutBy: { type: String },
    isTemplate:{type: Boolean, required:true, default: false},
    templateName: { type: String },
    templateDescription: { type: String },
    href: { type: String },
    fields:[FieldSchema],
    dataTables:[DataTableSchema],
    selectedEnumerations: [SelectedEnumerationSchema]
},{timestamps:true});

// If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
DocumentEntitySchema.pre('save',function (next){
    next();
});

// If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
DocumentEntitySchema.pre('update',function (next){
    next();
});

export interface IDocumentEntityComposite extends IDocumentEntity, Document {};

export const DocumentEntityComposite: Model<IDocumentEntityComposite> = 
    mongoose.model<IDocumentEntityComposite>('documentEntity', DocumentEntitySchema);
