import { mongoose } from '../config/database';
import { Schema, Model, Document } from 'mongoose';
import { IValidator, ValidatorSchema } from './validator';
import { FieldStyle, EnumHelper, ProcessingState, ResourceType } from '../enumerations';
import { IField } from "./field";

/*
name : user entered file name.
originalname	Name of the file on the user's computer	
encoding	Encoding type of the file	
mimetype	Mime type of the file	
size	Size of the file in bytes	
filename	The name of the file within the destination	
*/
export interface IResource extends Document{
    size?: number;
    originalName?: string;
    resourceType: ResourceType;
    fileName?: string;
    mimeType?: string;
    encoding?: string;
    href?: string;
    location?: string;
    processingState?: ProcessingState;
    isDoneProcessing?: boolean;
}

export const ResourceSchema = new Schema({
    size: { type: Number },
    originalName:  { type: String },
    resourceType: { type: Number, enum: [EnumHelper.getValuesFromEnum(ResourceType)], default: ResourceType.original },
    fileName:  { type: String },
    mimeType: { type: String },
    encoding: { type: String },
    href: { type: String },
    location: { type: String },
    processingState: { type: Number, enum: [EnumHelper.getValuesFromEnum(ProcessingState)], default: ProcessingState.Uploaded },
    isDoneProcessing: {type: Boolean, default: false}
},{timestamps:true, _id: true});

export interface IResourceComposite extends IResource, Document {};

export const ResourceComposite:Model<IResourceComposite> = mongoose.model<IResourceComposite>('resource', ResourceSchema);