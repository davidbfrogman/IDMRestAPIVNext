import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IValidator, ValidatorSchema } from './validator';
import { FieldStyle, EnumHelper, ProcessingState } from '../enumerations';
import { IField } from "./field";

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
    size?: number;
    originalName?: string;
    fileName?: string;
    mimeType?: string;
    encoding?: string;
    url?: string;
	sha256?: string;
    location?: string;
    processingState?: ProcessingState;
    isDoneProcessing?: boolean;
}

export const FileSchema = new Schema({
    name: { type: String },
    size: { type: Number },
    mimetype: { type: String },
    encoding: { type: String },
    originalName:  { type: String },
    fileName:  { type: String },
    url: { type: String },
    location: { type: String },
    sha256:  { type: String },
    processingState: { type: Number, enum: [EnumHelper.getValuesFromEnum(ProcessingState)], default: 1 },
    isDoneProcessing: {type: Boolean, default: false}
},{timestamps:true, _id: true});

export interface IFileComposite extends IFile, Document {};

export const FileComposite:Model<IFileComposite> = mongoose.model<IFileComposite>('file', FileSchema);