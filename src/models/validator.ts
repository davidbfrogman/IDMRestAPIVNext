import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { ValidationType, EnumHelper } from '../enumerations';

export interface IValidator extends Document {
    validationType: ValidationType;
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

ValidatorSchema.pre('save',(next)=>{
    // if(this.modifiedOn){
    //     this.modifiedOn = new Date();
    // }
    next();
});

export type ValidatorModel = Model<IValidator> & IValidator;

export const DocumentTemplateMI: ValidatorModel = <ValidatorModel>mongoose.model<IValidator>('Validator', ValidatorSchema);