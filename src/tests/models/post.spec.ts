// process.env.NODE_ENV = "testing";

// import { Post, Author, IAuthor } from "../../models/models";
// import {} from 'jasmine';

// describe("Posts", () => {

//     it("should insert new post", (done: Function) => {

//         const author = new Author();
//         author.name = "John";
//         author.description = "He is writer";

//         author.save(async(err: Error, _res: IAuthor) => {

//             //expect(_res).to.be.an("object");
//             expect(_res.name).toEqual("John");

//             await Post.create({
//                 author: _res._id,
//                 title: "Tile 1",
//                 description: "Lorem ipsum..."
//             }, {
//                 author: _res._id,
//                 title: "Tile 2",
//                 description: "Lorem ipsum..."
//             });

//             Post.findAllByAuthor(_res._id.toString()).then((posts)=>{
//                 expect(posts.title).toEqual('Tile 1');
//             }); 

//             done();
//         });

//     });

// });