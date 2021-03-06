import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IValidator, ValidatorSchema } from './validator';
import { FieldStyle, EnumHelper, ProcessingState, ResourceType } from '../enumerations';
import { IField } from "./field";
import { IResource } from "./resource";

/*
name : user entered file name.
originalname	Name of the file on the user's computer	
encoding	Encoding type of the file	
mimetype	Mime type of the file	
size	Size of the file in bytes	
filename	The name of the file within the destination	
*/
export interface IFile extends Document{
    name?: string;
    href?: string;
    resources: Array<IResource>;
    processingState?: ProcessingState;
    isDoneProcessing?: boolean;
}

export const FileSchema = new Schema({
    name: { type: String },
    href: { type: String },
    resources: [{ type : Schema.Types.ObjectId, ref: 'resource' }],
    processingState: { type: Number, enum: [EnumHelper.getValuesFromEnum(ProcessingState)], default: ProcessingState.Uploaded },
    isDoneProcessing: {type: Boolean, default: false}
},{timestamps:true, _id: true});

export interface IFileComposite extends IFile, Document {};

export const FileComposite:Model<IFileComposite> = mongoose.model<IFileComposite>('file', FileSchema);