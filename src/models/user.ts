import { mongoose } from '../config/database';
import { Schema, Model, Document, model } from 'mongoose';
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

const UserSchema = new Schema({
    username: {
        type: String, 
        unique:true,
        trim:true,
        required:true
    },
    passwordHash: {type: String, required: true, select: false},
    email: {type:String, unique:true},
    roles: [{ type : Schema.Types.ObjectId, ref: 'Role' }]
},{timestamps:true});

//If you do any pre save methods, and you use fat arrow syntax 'this' doesn't refer to the document.
UserSchema.pre('save',function(next){
    //If there's any validators, this field requires validation.
    next();
});

export interface IUserMongooseComposite extends IUser, Document {};

export const UserMongooseComposite:Model<IUserMongooseComposite> = mongoose.model<IUserMongooseComposite>('User', UserSchema);