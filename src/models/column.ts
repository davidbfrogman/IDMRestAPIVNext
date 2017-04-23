import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IValidator, ValidatorSchema } from './validator';
import { FieldStyle, EnumHelper } from '../enumerations';
import { IField } from "./field";

export interface IColumn{
    name: String;
    tooltip?: string;
    description?: String;
    fieldStyle: FieldStyle;
    values: Array<string>;
    validators?: Array<IValidator>;
}

export const ColumnSchema = new Schema({
    name: { type: String },
    description: { type: String },
    tooltip: { type: String },
    fieldStyle: { type: Number, enum: [EnumHelper.GetValuesFromEnum(FieldStyle)] },
    validators: [ValidatorSchema],
    values: {type: [String] }
},{timestamps:false, _id: false});


export interface IColumnComposite extends IColumn, Document {};

export const ColumnComposite:Model<IColumnComposite> = mongoose.model<IColumnComposite>('column', ColumnSchema);