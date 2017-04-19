import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IField, FieldSchema } from './field'

export interface IPermission extends Document {
    name: String;
    description: String;
    value: string;
    createdAt?: Date; //Automatically created by mongoose.
    modifiedAt?: Date; //Automatically created by mongoose.
}

export const PermissionSchema = new Schema({
    name: {type: String},
    description: {type: String},
    value: {type: String}
},{timestamps:true});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
PermissionSchema.pre('save',function(next){
    //If there's any validators, this field requires validation.
    next();
});

export type PermissionModel = Model<IPermission> & IPermission;

export const PermissionMI: PermissionModel = <PermissionModel>mongoose.model<IPermission>('Permission', PermissionSchema);