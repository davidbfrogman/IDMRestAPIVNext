import { IDocumentEntity } from "../models/document-entity";
import { IValidationError } from "../models/validation-error";
import { FieldValidator } from "./field.validator";
import { FieldStyle } from "../enumerations";
import { IColumn } from "../models/column";

export class DocumentEntityValidator {

    public static isValid(document: IDocumentEntity): IValidationError[] {
        let validationErrors = new Array<IValidationError>();

        // Validate Data Table column length matches
        if (document.dataTables) {
            for (let index = 0; index < document.dataTables.length; index++) {
                let dataTable = document.dataTables[index];
                // We're only going to validate column length if there's more than one column.
                if (dataTable && dataTable.columns && dataTable.columns.length > 1) {
                    let firstLength = 0;
                    for (let index = 0; index < dataTable.columns.length; index++) {
                        let column = dataTable.columns[index];
                        let columnLength = this.getColumnLength(column);

                        if (index === 0) {
                            firstLength = columnLength;
                        }
                        if (firstLength != columnLength) {
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

        if (document.fields) {
            // Validate each field on the document
            for (var index = 0; index < document.fields.length; index++) {
                var field = document.fields[index];
                validationErrors = validationErrors.concat(FieldValidator.isValid(field));
            }
        }

        return validationErrors;
    }

    public static getColumnLength(column: IColumn): number {
        let columnLength = 0;
        switch (column.fieldStyle) {
            case FieldStyle.String:
                columnLength = column.stringValues ? column.stringValues.length : 0;
                break;
            case FieldStyle.Boolean:
                columnLength = column.booleanValues ? column.booleanValues.length : 0;
                break;
            case FieldStyle.Time:
            case FieldStyle.Timestamp:
            case FieldStyle.Date:
                columnLength = column.dateValues ? column.dateValues.length : 0;
                break;
            case FieldStyle.Number:
                columnLength = column.numberValues ? column.numberValues.length : 0;
                break;
            default:
                break;
        }
        return columnLength;
    }
}