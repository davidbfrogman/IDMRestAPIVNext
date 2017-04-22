import { Document, Model, Schema } from 'mongoose';
import { mongoose } from '../config/database';
import { FieldSchema, IField } from './field'
import { IEnterpriseEnumeration } from "./enterprise-enumeration";
import { IDataTable, DataTableSchema } from "./data-table";

export interface ISelectedEnumeration extends Document{
    selectedValue: string;
    fromEnumeration: IEnterpriseEnumeration;
}

export const SelectedEnumerationSchema = new Schema({
    selectedValue: {type: String},
    fromEnumeration: { type : Schema.Types.ObjectId, ref: 'enterpriseEnumeration' }
},{timestamps:false, _id: false});

export interface ISelectedEnumerationComposite extends ISelectedEnumeration, Document {};

export const SelectedEnumerationComposite: Model<ISelectedEnumerationComposite> = 
    mongoose.model<ISelectedEnumerationComposite>('selectedEnumeration', SelectedEnumerationSchema);