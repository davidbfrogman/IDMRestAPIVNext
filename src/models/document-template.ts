import { mongoose } from "../config/database";
import { Schema, Model, Document } from "mongoose";

export interface IDocumentTemplate extends Document {
    name: string
    createdOn?: Date;
    modifiedOn?: Date;
    description?: string;
    updateDescription(id: {}, description: string): Promise<{ nModified: number }>
}

const schema = new Schema({
    name: { type: String },
    createdOn: { type: Date, "default": Date.now },
    modifiedOn: { type: Date, },
    description: { type: String }
});

schema.static("updateDescription", (documentTemplateId: {}, description: string) => {
    return DocumentTemplate.update(
        { "_id": documentTemplateId },
        {
            "$set": {
                "description": description,
                "modifiedOn": Date.now
            }
        })
        .exec();
});

export type DocumentTemplateModel = Model<IDocumentTemplate> & IDocumentTemplate;

export const DocumentTemplate: DocumentTemplateModel = <DocumentTemplateModel>mongoose.model<IDocumentTemplate>("DocumentTemplate", schema);