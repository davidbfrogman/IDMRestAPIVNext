import { IDocumentEntity } from "../models/document-entity";
import { IValidationError } from "../models/validation-error";
import { FieldValidator } from "./field.validator";

export class DocumentEntityValidator {

    public static isValid(document: IDocumentEntity): IValidationError[] {
        let validationErrors = new Array<IValidationError>();

        // Validate Data Table column length matches
        if (document.dataTables) {
            for (var index = 0; index < document.dataTables.length; index++) {
                var dataTable = document.dataTables[index];
                // We're only going to validate column length if there's more than one column.
                if (dataTable && dataTable.columns && dataTable.columns.length > 1) {
                    let firstLength = 0;
                    for (var index = 0; index < dataTable.columns.length; index++) {
                        var column = dataTable.columns[index];
                        if (column.values && column.values.length) {
                            if (index === 0) {
                                firstLength = column.values.length;
                            }
                            if (firstLength != column.values.length) {
                                validationErrors.push({
                                    message: `Column Length for data table: ${dataTable.name}, does not match for all columns.  All columns must have the same number of entries.`,
                                    path: `${document.name}/${dataTable.name}/${column.name}`,
                                    field: `column: ${column.name}`,
                                    value: 'This validation just checks length, so no specific value availible.'
                                })
                            }
                        }
                    }
                }
            }
        }

        // Validate each field on the document
        for (var index = 0; index < document.fields.length; index++) {
            var field = document.fields[index];
            validationErrors = validationErrors.concat(FieldValidator.isValid(field));
        }

        return validationErrors;
    }
}