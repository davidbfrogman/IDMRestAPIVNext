import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IValidator, ValidatorSchema } from './validator';
import { FieldStyle, PrimitiveType, EnumHelper } from '../enumerations';

export interface IField extends Document {
    name: string;
    description: string;
    tooltip: string;
    fieldStyle: FieldStyle;
    primitiveType: PrimitiveType;
    requiresValidation: boolean;
    validators: Array<IValidator>;
    value: string;
}

export const FieldSchema = new Schema({
    name: { type: String },
    description: { type: String },
    tooltip: { type: String },
    fieldStyle: { type: Number, enum: [EnumHelper.GetValuesFromEnum(FieldStyle)] },
    primitiveType: { type: Number, enum: [EnumHelper.GetValuesFromEnum(PrimitiveType)] },
    requiresValidation: {type: Boolean, required: true},
    validators: [ValidatorSchema],
    value: {type: String}
},{timestamps:true});

FieldSchema.pre('save',(next)=>{
    // if(this.modifiedOn){
    //     this.modifiedOn = new Date();
    // }
    next();
});

export type FieldModel = Model<IField> & IField;

export const FieldMI: FieldModel = <FieldModel>mongoose.model<IField>('Field', FieldSchema);