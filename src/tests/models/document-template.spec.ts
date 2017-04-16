process.env.NODE_ENV = 'testing';
import { DocumentTemplateMI, IDocumentTemplate } from '../../models/document-template';
import * as chai from 'chai';
const expect = chai.expect;

describe('Models Document Template', () => {

    let documentTemplateObj: IDocumentTemplate;

    it('create a new document template', () => {
        const docTemplate = new DocumentTemplateMI();
        docTemplate.name = 'New Test Doc Template';
        docTemplate.description = 'Brand spanking new Document template description';

        docTemplate.save((err: Error, res: IDocumentTemplate) => {
           documentTemplateObj = res;
           expect(res._id).to.be.true;
        });
    });
});