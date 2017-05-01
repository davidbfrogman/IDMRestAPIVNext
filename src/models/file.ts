import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IValidator, ValidatorSchema } from './validator';
import { FieldStyle, EnumHelper } from '../enumerations';
import { IField } from "./field";

export interface IFile{
    name: string;
    size?: number;
    mimetype?: string;
    fileName?: string;
    url?: string;
	sha256?: string;
    location?: string;
    isDoneProcessing?: boolean;
}

export const FileSchema = new Schema({
    name: { type: String },
    size: { type: Number },
    mimetype: { type: String },
    fileName:  { type: String },
    url: { type: String },
    location: { type: String },
    sha256:  { type: String },
    isDoneProcessing: {type: Boolean, default: false}
},{timestamps:true, _id: true});

export interface IFileComposite extends IFile, Document {};

export const FileComposite:Model<IFileComposite> = mongoose.model<IFileComposite>('file', FileSchema);