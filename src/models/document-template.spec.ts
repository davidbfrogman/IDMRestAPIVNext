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

    // it("should update user", async(done: Function) => {
    //     const results: { nModified: number} = await Author.updateAuthor(authorObject._id, "He is not writer");

    //     expect(results.nModified).toEqual(1);
    //     done();
    // });

    // it("should update by age", async(done: Function) => {
    //     const results: { nModified: number} = await Author.updateByAge(21, "Good one :)");
    //     const author: IAuthor = <IAuthor>await Author.findById(authorObject._id).exec();

    //     expect(author.description).toEqual("Good one :)");
    //     expect(results.nModified).toEqual(1);
    //     done();
    // });
});