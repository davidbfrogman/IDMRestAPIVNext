import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IValidator, ValidatorSchema } from './validator';
import { FieldStyle, PrimitiveType, EnumHelper } from '../enumerations';
import { IField } from "./field";
import { IColumn, ColumnSchema } from "./column";

export interface IDataTable extends Document {
    name: string;
    description: string;
    columns: Array<IColumn>;
}

export const DataTableSchema = new Schema({
    name: { type: String },
    description: { type: String },
    columns:[ColumnSchema],
},{timestamps:false});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
DataTableSchema.pre('save',function(next){
    next();
});
//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
DataTableSchema.pre('update',function(next){
    next();
});

export interface IDataTableComposite extends IDataTable, Document {};

export const DataTableComposite:Model<IDataTableComposite> = mongoose.model<IDataTableComposite>('dataTable', DataTableSchema);
