import { IValidationError } from "./models/validation-error";

export interface BulkUpdateSummary {
  totalItemsUpdated: number;
  validationErrors: IValidationError[];
}
