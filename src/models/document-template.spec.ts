process.env.NODE_ENV = "testing";
import { DocumentTemplate, IDocumentTemplate } from "./document-template";
import * as chai from "chai";
const expect = chai.expect;

describe("Models Document Template", () => {

    let documentTemplateObj: IDocumentTemplate;

    it("create a new document template", () => {
        const docTemplate = new DocumentTemplate();
        docTemplate.name = 'New Test Doc Template';
        docTemplate.description = 'Brand spanking new Document template description';

        docTemplate.save((err: Error, res: IDocumentTemplate) => {
           documentTemplateObj = res;
           expect(res._id).to.be.true;
        });
    });
});