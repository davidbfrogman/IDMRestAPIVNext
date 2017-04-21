import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { ValidationType, EnumHelper } from '../enumerations';

export interface IValidator extends Document {
    validationType: ValidationType; //Length, required, regex
    min: number;
    max: number;
    regex: string;
    dateMax: Date;
    dateMin: Date;
}

export const ValidatorSchema = new Schema({
    validationType: { type: Number, enum: [EnumHelper.GetValuesFromEnum(ValidationType)] },
    min: {type: Number},
    max: {type:Number},
    regex: {type:String},
    dateMax: {type:Date},
    dateMin: {type:Date}
},{timestamps:true});

ValidatorSchema.pre('save',function(next){
    //If there's any validators, this field requires validation.
    next();
});

export interface IValidatorMongooseComposite extends IValidator, Document {};

export const ValidatorMongooseComposite:Model<IValidatorMongooseComposite> = mongoose.model<IValidatorMongooseComposite>('Validator', ValidatorSchema);