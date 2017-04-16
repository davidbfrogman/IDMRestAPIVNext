process.env.NODE_ENV = "testing";

import {} from 'jasmine';

//import { server } from "../../app";

describe("Api Author", function(): void {

    it("should be able to create user", (done:Function): void => {
        // chai.request(server)
        //     .post("/api/author")
        //     .set("content-type", "application/json")
        //     .send({
        //         name: "Someone",
        //         description: "..."
        //     })
        //     .end((err:Error, res: any): void => {
        //         expect(res.statusCode).to.be.equal(200);
        //         expect(res.body.name).to.be.equal("Someone");
        //         done();
        //     });
    });

    it("should be able to get users", (done:Function): void => {
        // chai.request(server)
        //     .get("/api/author")
        //     .end((err:Error, res: any): void => {
        //         expect(res.statusCode).to.be.equal(200);
        //         expect(res.body.length).to.be.equal(3);
        //         done();
        //     });
    });
});