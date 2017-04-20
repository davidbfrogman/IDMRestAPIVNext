import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IField, FieldSchema } from './field';
import { IPermission, PermissionSchema } from './permission';

export interface IRole extends Document {
    name: String;
    description: String;
    permissions: Array<IPermission>;
    createdAt?: Date; //Automatically created by mongoose.
    modifiedAt?: Date; //Automatically created by mongoose.
}

export const RoleSchema = new Schema({
    name: {type: String},
    description: {type: String},
    permissions: [{type: Schema.Types.ObjectId, ref: 'Permission'}]
},{timestamps:true});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
RoleSchema.pre('save',function(next){
    //If there's any validators, this field requires validation.
    next();
});

export type RoleModel = Model<IRole> & IRole;

export const RoleMI: RoleModel = <RoleModel>mongoose.model<IRole>('Role', RoleSchema);