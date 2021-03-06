import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IValidator, ValidatorSchema } from './validator';
import { FieldStyle, EnumHelper } from '../enumerations';

export interface IField extends Document {
    name: string;
    description: string;
    tooltip?: string;
    fieldStyle: FieldStyle;
    validators?: Array<IValidator>;
    stringValue: string;
    numberValue: number;
    dateValue: Date;
    booleanValue: boolean;
}

export const FieldSchema = new Schema({
    name: { type: String },
    description: { type: String },
    tooltip: { type: String },
    fieldStyle: { type: Number, enum: [EnumHelper.getValuesFromEnum(FieldStyle)] },
    validators: [ValidatorSchema],
    stringValue: { type: String },
    numberValue: { type: Number },
    dateValue: { type: Date },
    booleanValue: { type: Boolean }
}, { timestamps: false, _id: false });

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
FieldSchema.pre('save', function (next) {
    next();
});
//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
FieldSchema.pre('update', function (next) {
    next();
});

export interface IFieldComposite extends IField, Document { };

export const FieldComposite: Model<IFieldComposite> = mongoose.model<IFieldComposite>('field', FieldSchema);