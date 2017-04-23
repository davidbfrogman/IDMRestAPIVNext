import { ValidationError } from "../models/validation-error";
import { IField } from "../models/field";
import { FieldStyle } from "../enumerations";
import * as moment from 'moment';

export class FieldValidator {

    public static isValid(field: IField): ValidationError[] {
        const validationErrors = new Array<ValidationError>();

        // Check validators
        if (field.validators && field.validators.length > 0) {

        }
        
        // Check Types
        switch (field.fieldStyle) {
            case FieldStyle.Number:
                if (isNaN(+field.value)) {
                    // Input was not a number so throw a validation error.
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a number, but it was not.",
                        path: `/field/${field.name}`,
                        value: field.value
                    });
                }
                break;
            case FieldStyle.Date:
                let date = moment(field.value, 'DD/MM/YYYY', true);
                if (!date) {
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a date, but it was not. Date format should be DD/MM/YYYY",
                        path: `/field/${field.name}`,
                        value: field.value
                    });
                }
                break;
            case FieldStyle.Timestamp:
                //2017-04-23T12:34:15.791Z
                let timestamp = moment(field.value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true);
                if (!timestamp) {
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a timestamp, but it was not. Timestamp format should be YYYY-MM-DDTHH:mm:ss.SSSZ eg. 2017-04-23T12:34:15.791Z",
                        path: `/field/${field.name}`,
                        value: field.value
                    });
                }
                break;
            case FieldStyle.Time:
                let time = moment(field.value, 'HH:mm:ss.SSSZ', true);
                if (!timestamp) {
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a time, but it was not. Time format should be HH:mm:ss.SSSZ eg 03:45:21.333Z",
                        path: `/field/${field.name}`,
                        value: field.value
                    });
                }
                break;
            case FieldStyle.Boolean:
                if (!(field.value == 'true' || field.value == 'false')) {
                    validationErrors.push({
                        field: field.name,
                        message: "Expected type to be a boolean, but it was not. booleans should be true or false, case sensitive",
                        path: `/field/${field.name}`,
                        value: field.value
                    });
                }
                break;
            default:
                break;
        }
        return validationErrors;
    }
}