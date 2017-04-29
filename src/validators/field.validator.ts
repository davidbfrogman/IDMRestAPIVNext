import { IValidationError } from "../models/validation-error";
import { IField } from "../models/field";
import { FieldStyle } from "../enumerations";
import * as moment from 'moment';

export class FieldValidator {

    public static isValid(field: IField): IValidationError[] {
        const validationErrors = new Array<IValidationError>();

        // Check validators
        if (field.validators && field.validators.length > 0) {

        }
        
        // Check Types
        switch (field.fieldStyle) {
            case FieldStyle.Number:
                if (isNaN(+field.numberValue)) {
                    // Input was not a number so throw a validation error.
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a number, but it was not.",
                        path: `/field/${field.name}`,
                        value: field.numberValue.toString()
                    });
                }
                break;
            case FieldStyle.Date:
                let date = moment(field.dateValue, 'DD/MM/YYYY', true);
                if (!date) {
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a date, but it was not. Date format should be DD/MM/YYYY",
                        path: `/field/${field.name}`,
                        value: field.dateValue.toString()
                    });
                }
                break;
            case FieldStyle.Timestamp:
                //2017-04-23T12:34:15.791Z
                let timestamp = moment(field.dateValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true);
                if (!timestamp) {
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a timestamp, but it was not. Timestamp format should be YYYY-MM-DDTHH:mm:ss.SSSZ eg. 2017-04-23T12:34:15.791Z",
                        path: `/field/${field.name}`,
                        value: field.dateValue.toString()
                    });
                }
                break;
            case FieldStyle.Time:
                let time = moment(field.dateValue, 'HH:mm:ss.SSSZ', true);
                if (!timestamp) {
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a time, but it was not. Time format should be HH:mm:ss.SSSZ eg 03:45:21.333Z",
                        path: `/field/${field.name}`,
                        value: field.dateValue.toString()
                    });
                }
                break;
            case FieldStyle.Boolean:
                if (!(field.booleanValue === true || field.booleanValue === false)) {
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a boolean, but it was not. booleans should be true or false, case sensitive",
                        path: `/field/${field.name}`,
                        value: field.booleanValue
                    });
                }
                break;
            case FieldStyle.String:
                if (!(typeof field.stringValue === "string")) {
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a boolean, but it was not. booleans should be true or false, case sensitive",
                        path: `/field/${field.name}`,
                        value: field.stringValue
                    });
                }
                break;
            default:
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to match one  of the existing types, but it didn't.  Each field must have a field style.",
                        path: `/field/${field.name}`,
                        value: null
                    });
                break;
        }
        return validationErrors;
    }
}