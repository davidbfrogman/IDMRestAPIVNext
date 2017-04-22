import { NextFunction, Request, RequestHandler, RequestParamHandler, Response, Router } from 'express';
import { EnterpriseDocumentComposite, IEnterpriseDocument } from '../models/enterprise-document';
import { Document, Model, Schema } from 'mongoose';
import { BaseController } from './base/base.controller';
import { IField, FieldComposite } from "../models/field";
import { FieldStyle, PrimitiveType, EnumHelper, ValidationType } from '../enumerations';
import { EnterpriseEnumerationController } from "./enterprise-enumeration.controller";
import { EnterpriseEnumerationComposite, IEnterpriseEnumeration } from "../models/enterprise-enumeration";
import { DataTableComposite } from "../models/data-table";
import { ValidatorComposite } from "../models/validator";
import { SelectedEnumerationComposite } from "../models/selected-enumeration";
import { ColumnComposite } from "../models/column";

export class EnterpriseDocumentController extends BaseController<IEnterpriseDocument> {
    public defaultPopulationArgument =
    {
        path: 'selectedEnumerations.fromEnumeration'
    };

    constructor() {
        super();
        super.mongooseModelInstance = EnterpriseDocumentComposite;
    }

    public utility(request: Request, response: Response, next: NextFunction): void {
        EnterpriseEnumerationComposite.findById('58fb3e868280782334460839').exec().then((foundEnum) => {
            let selectedEnumeration = new SelectedEnumerationComposite();
            selectedEnumeration.selectedValue = foundEnum.enumerationValues[1].value
            selectedEnumeration.fromEnumeration = foundEnum;
            let fields = new Array<IField>();

            let Invoicefield = new FieldComposite();
            Invoicefield.name = "Invoice Number";
            Invoicefield.description = "The invoice number for an invoice";
            Invoicefield.tooltip = "This is the fancy invoice number";
            Invoicefield.fieldStyle = FieldStyle.Number;
            Invoicefield.primitiveType = PrimitiveType.Number;
            Invoicefield.value = "12356";

            let InvoiceTotal = new FieldComposite();
            InvoiceTotal.name = "Invoice Total";
            InvoiceTotal.description = "The total on the invoice";
            InvoiceTotal.tooltip = "A total across the invoice";
            InvoiceTotal.fieldStyle = FieldStyle.Number;
            InvoiceTotal.primitiveType = PrimitiveType.Decimal;
            InvoiceTotal.value = "456798.54";

            fields.push(Invoicefield);
            fields.push(InvoiceTotal);

            let bearDataTable = new DataTableComposite();
            let bearNameColumn = new ColumnComposite();
            let bearWeightColumn = new ColumnComposite();
            let validator = new ValidatorComposite();
            validator.validationType = ValidationType.Required
            validator.min = 0;
            validator.max = 100;

            bearNameColumn.name = "Bear Name";
            bearNameColumn.tooltip = "Enter a name for your bear";
            bearNameColumn.description = "Every Bear needs a name";
            bearNameColumn.fieldStyle = FieldStyle.String;
            bearNameColumn.primitiveType = PrimitiveType.String;
            bearNameColumn.values = ["Smokey", "Boo-Boo", "Sleepy"];
            bearNameColumn.validators.push(validator);
            bearDataTable.columns.push(bearNameColumn);

            bearWeightColumn.name = "Bear Weight";
            bearWeightColumn.tooltip = "A weight is important";
            bearWeightColumn.description = "Every Bear needs a Weight";
            bearWeightColumn.fieldStyle = FieldStyle.Number;
            bearWeightColumn.primitiveType = PrimitiveType.Decimal;
            bearWeightColumn.values = ["200.2", "54.4", "82.9"];
            bearWeightColumn.validators.push(validator);
            bearDataTable.columns.push(bearWeightColumn);

            let edc = new EnterpriseDocumentComposite();
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
