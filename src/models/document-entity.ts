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

/*
When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema. 
Mongoose will call ensureIndex for each index sequentially, and emit an 'index' event on the model when all the ensureIndex calls succeeded or when there was an error. 
While nice for development, it is recommended this behavior be disabled in production since index creation can cause a significant performance impact. 
Disable the behavior by setting the autoIndex option of your schema to false, or globally on the connection by setting the option config.autoIndex to false.
*/
DocumentEntitySchema.index({ 'dataTables.columns.stringValues' : 'text',
                             'fields.stringValue': 'text',
                             'name': 'text',
                            'description': 'text'
                        }, {name: 'IDM_Document_Entity_Index', weights: {'fields.stringValue': 10, 'name': 4, 'description': 2, 'dataTables.columns.stringValues': 1}});

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
