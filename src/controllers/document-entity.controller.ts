import { NextFunction, Request, RequestHandler, RequestParamHandler, Response, Router } from 'express';
import { DocumentEntityComposite, IDocumentEntity } from '../models/document-entity';
import { Document, Model, Schema } from 'mongoose';
import { BaseController } from './base/base.controller';
import { IField, FieldComposite } from "../models/field";
import { EnterpriseEnumerationController } from "./enterprise-enumeration.controller";
import { EnterpriseEnumerationComposite, IEnterpriseEnumeration } from "../models/enterprise-enumeration";
import { DataTableComposite } from "../models/data-table";
import { ValidatorComposite } from "../models/validator";
import { SelectedEnumerationComposite } from "../models/selected-enumeration";
import { ColumnComposite } from "../models/column";
import { Constants } from "../constants";
import { IValidationError } from "../models/validation-error";
import { DocumentEntityValidator } from "../validators/document-entity.validator";
import { FieldStyle, ValidationType } from "../enumerations";
import { rabbit, exchange } from '../config/queue';
import { IFile } from "../models/file";

let Promise = require("bluebird");

export class DocumentEntityController extends BaseController<IDocumentEntity> {

    public defaultPopulationArgument =
    {
        path: 'selectedEnumerations.fromEnumeration'
    };

    constructor() {
        super();
        super.mongooseModelInstance = DocumentEntityComposite;
    }

    public preCreateHook(model: IDocumentEntity): Promise<IDocumentEntity> {
        model.href = `${Constants.APIEndpoint}${Constants.DocumentEntitiesEndpoint}/${model._id}`;
        return Promise.resolve(model);
    }

    public preUpdateHook(model: IDocumentEntity, request: Request): Promise<IDocumentEntity> {
        return DocumentEntityComposite.findById(super.getId(request))
        .then((document) => {
            model.href = `${Constants.APIEndpoint}${Constants.DocumentEntitiesEndpoint}/${model._id}`;
            // TODO always get the current version from the database.
            model.version = ++document.version;
            return model;
        });
    }

    public isValid(model: IDocumentEntity): IValidationError[] {
        return DocumentEntityValidator.isValid(model);
    }

    public utility(request: Request, response: Response, next: NextFunction): void {

        EnterpriseEnumerationComposite.findById('58fc98cc4f87e25f4c76174e').exec().then((foundEnum) => {
            let selectedEnumeration = new SelectedEnumerationComposite();
            selectedEnumeration.selectedValue = foundEnum.enumerationValues[1].value
            selectedEnumeration.fromEnumeration = foundEnum;
            let fields = new Array<IField>();

            let Invoicefield = new FieldComposite();
            Invoicefield.name = "Invoice Name";
            Invoicefield.description = "The invoice Name for an invoice";
            Invoicefield.tooltip = "This is the fancy invoice Name";
            Invoicefield.fieldStyle = FieldStyle.String;
            Invoicefield.stringValue = "AX1287";
            fields.push(Invoicefield);

            let InvoiceTotal = new FieldComposite();
            InvoiceTotal.name = "Invoice Total";
            InvoiceTotal.description = "The total on the invoice";
            InvoiceTotal.tooltip = "A total across the invoice";
            InvoiceTotal.fieldStyle = FieldStyle.Number;
            InvoiceTotal.numberValue = 456798.54;
            fields.push(InvoiceTotal);

            let invoiceShipped = new FieldComposite();
            invoiceShipped.name = "Is Invoice Shipped";
            invoiceShipped.description = "Has it been shipped";
            invoiceShipped.fieldStyle = FieldStyle.Boolean;
            invoiceShipped.booleanValue = false;
            fields.push(invoiceShipped);
           
            let invoiceShipDate = new FieldComposite();
            invoiceShipDate.name = "Date the invoice was shipped";
            invoiceShipDate.description = "Shipping Date";
            invoiceShipDate.fieldStyle = FieldStyle.Date;
            invoiceShipDate.dateValue = new Date();
            fields.push(invoiceShipDate);

            let bearDataTable = new DataTableComposite();
            let bearNameColumn = new ColumnComposite();
            let bearWeightColumn = new ColumnComposite();
            let bearSuperStarColumn = new ColumnComposite();
            let bearBirthDate = new ColumnComposite();

            let validator = new ValidatorComposite();
            validator.validationType = ValidationType.Required
            validator.min = 0;
            validator.max = 100;

            bearNameColumn.name = "Bear Name";
            bearNameColumn.tooltip = "Enter a name for your bear";
            bearNameColumn.description = "Every Bear needs a name";
            bearNameColumn.fieldStyle = FieldStyle.String;
            bearNameColumn.stringValues = ["Smokey", "Boo-Boo", "Sleepy"];
            bearNameColumn.validators.push(validator);
            bearDataTable.columns.push(bearNameColumn);

            bearWeightColumn.name = "Bear Weight";
            bearWeightColumn.tooltip = "A weight is important";
            bearWeightColumn.description = "Every Bear needs a Weight";
            bearWeightColumn.fieldStyle = FieldStyle.Number;
            bearWeightColumn.numberValues = [200.2, 54.4, 82.9];
            bearWeightColumn.validators.push(validator);
            bearDataTable.columns.push(bearWeightColumn);

            bearSuperStarColumn.name = "Is Super Star";
            bearSuperStarColumn.tooltip = "How many shows has he done";
            bearSuperStarColumn.description = "Gotta love super stars";
            bearSuperStarColumn.fieldStyle = FieldStyle.Boolean;
            bearSuperStarColumn.booleanValues = [true, false, false];
            bearSuperStarColumn.validators.push(validator);
            bearDataTable.columns.push(bearSuperStarColumn);

            bearBirthDate.name = "Birthday";
            bearBirthDate.tooltip = "Baloons all around";
            bearBirthDate.description = "Birthday time!";
            bearBirthDate.fieldStyle = FieldStyle.Date;
            bearBirthDate.dateValues = [new Date(),new Date(), new Date()];
            bearBirthDate.validators.push(validator);
            bearDataTable.columns.push(bearBirthDate);

            let edc = new DocumentEntityComposite();
            edc.name = "New Document";
            edc.description = "New Description";
            edc.fields = fields;
            edc.version = 0;
            edc.isCheckedOut = false;
            edc.selectedEnumerations.push(selectedEnumeration);
            edc.dataTables.push(bearDataTable);
            response.json(edc);
        });
    }
}
