import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IField, FieldSchema } from './field'
import { IRole, RoleSchema } from "./role";

export interface IUser extends Document {
    username: string;
    passwordHash: string;
    email: string;
    roles: Array<IRole>;
    createdAt?: Date; //Automatically created by mongoose.
    modifiedAt?: Date; //Automatically created by mongoose.
}

export const UserSchema = new Schema({
    username: {type: String, unique:true},
    passwordHash: {type: String},
    email: {type:String, unique:true},
    roles: [RoleSchema]
},{timestamps:true});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
UserSchema.pre('save',function(next){
    //If there's any validators, this field requires validation.
    next();
});

export type UserModel = Model<IUser> & IUser;

export const UserMI: UserModel = <UserModel>mongoose.model<IUser>('User', UserSchema);