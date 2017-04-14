process.env.NODE_ENV = "testing";

import { Author, IAuthor } from "../../models/models";
import {} from 'jasmine';


describe("Models Author", () => {

    let authorObject: IAuthor;

    it("should insert new author", (done: Function) => {

        const author = new Author();
        author.name = "John";
        author.age = 30;
        author.description = "He is writer";

        author.save((err: Error, res: IAuthor) => {

           authorObject = res;

           expect(res.name).toBe("John");
           done();
        });

    });

    it("should update user", async(done: Function) => {
        const results: { nModified: number} = await Author.updateAuthor(authorObject._id, "He is not writer");

        expect(results.nModified).toEqual(1);
        done();
    });

    it("should update by age", async(done: Function) => {
        const results: { nModified: number} = await Author.updateByAge(21, "Good one :)");
        const author: IAuthor = <IAuthor>await Author.findById(authorObject._id).exec();

        expect(author.description).toEqual("Good one :)");
        expect(results.nModified).toEqual(1);
        done();
    });
});