import { IDocumentEntity } from "../models/document-entity";
import { ValidationError } from "../models/validation-error";

export class DocumentEntityValidator {

    public static isValid(model: IDocumentEntity): ValidationError[] {
        const validationErrors = new Array<ValidationError>();
        if (model.dataTables) {
            for (var index = 0; index < model.dataTables.length; index++) {
                var dataTable = model.dataTables[index];
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
                                    path: `${model.name}/${dataTable.name}/${column.name}`,
                                    field: `column: ${column.name}`,
                                    value: 'This validation just checks length, so no specific value availible.'
                                })
                            }
                        }
                    }
                }
            }
        }
        return validationErrors;
    }
}