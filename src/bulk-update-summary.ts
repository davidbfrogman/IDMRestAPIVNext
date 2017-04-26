import { IValidationError } from "./models/validation-error";
import { ObjectId } from "@types/bson";

export interface BulkUpdateSummary {
  totalItemsUpdated: number;
  validationErrors: IValidationError[];
  itemIdsUpdated: ObjectId[];
  itemIdsFailed: ObjectId[];
}
