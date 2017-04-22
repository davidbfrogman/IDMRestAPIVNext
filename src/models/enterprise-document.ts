import { Document, Model, Schema } from 'mongoose';
import { mongoose } from '../config/database';
import { FieldSchema, IField } from './field'
import { IEnterpriseEnumeration } from "./enterprise-enumeration";
import { IDataTable, DataTableSchema } from "./data-table";
import { ISelectedEnumeration, SelectedEnumerationSchema } from "./selected-enumeration";

export interface IEnterpriseDocument extends Document {
    name: string
    description?: string;
    fields: IField[];
    selectedEnumerations: ISelectedEnumeration[];
    version: number;
    isCheckedOut: boolean;
    checkedOutBy: string;
    checkedOutDate: Date;
    createdAt?: Date; // Automatically created by mongoose.
    modifiedAt?: Date; // Automatically created by mongoose.
    dataTables: IDataTable[];
}

export const EnterpriseDocumentSchema = new Schema({
    name: { type: String },
    description: { type: String },
    version:{type:Number, default:0},
    isCheckedOut:{type: Boolean, required:true, default: false},
    checkedOutBy: { type: String },
    fields:[FieldSchema],
    dataTables:[DataTableSchema],
    selectedEnumerations: [SelectedEnumerationSchema]
},{timestamps:true});

// If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
EnterpriseDocumentSchema.pre('save',function (next){
    next();
});

// If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
EnterpriseDocumentSchema.pre('update',function (next){
    // If there's any validators, this field requires validation.
    // TODO: Pull the version from the db, remember update could be only a partial doc template;
    this.version = this.version ? this.version++ : null;
    next();
});

export interface IEnterpriseDocumentComposite extends IEnterpriseDocument, Document {};

export const EnterpriseDocumentComposite: Model<IEnterpriseDocumentComposite> = 
    mongoose.model<IEnterpriseDocumentComposite>('enterpriseDocument', EnterpriseDocumentSchema);
