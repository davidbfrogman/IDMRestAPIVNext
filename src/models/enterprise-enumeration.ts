import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IField, FieldSchema } from './field';

export interface IEnumValue{
    name: string;
    value: string;
}

export interface IEnterpriseEnumeration extends Document {
    name: string;
    description?: string;
    enumerationValues: Array<IEnumValue>;
    href: string;
    createdAt?: Date; //Automatically created by mongoose.
    modifiedAt?: Date; //Automatically created by mongoose.
}

export const EnterpriseEnumerationSchema = new Schema({
    name: {type: String},
    description: {type: String},
    href: {type: String},
    enumerationValues: {type: Array<IEnumValue>()},
},{timestamps:true});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
EnterpriseEnumerationSchema.pre('save',function(next){
    //If there's any EnterpriseEnumerations, this field requires validation.
    next();
});

export interface IEnterpriseEnumerationComposite extends IEnterpriseEnumeration, Document {};

export const EnterpriseEnumerationComposite:Model<IEnterpriseEnumerationComposite> 
    = mongoose.model<IEnterpriseEnumerationComposite>('enterpriseEnumeration', EnterpriseEnumerationSchema);