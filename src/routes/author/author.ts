// import { Router, Request, Response } from "express";
// import { Author } from "../../models/author/model";

// export class AuthorRouter {

//     private router: Router = Router();

//     getRouter(): Router {

//         /**
//          * @swagger
//          * /api/author:
//          *   get:
//          *     tags:
//          *      - Author
//          *     description:
//          *      List of all authors registered in system.
//          *     produces:
//          *       - application/json
//          *     responses:
//          *       200:
//          *         description: Authors
//          *       400:
//          *         description: Invalid request
//          *       403:
//          *         description: Forbidden
//          */
//         this.router.get("/author", async(request: Request, response: Response) => {
//             const authors = await Author.find({}).exec();
//             console.log('again159');
//             response.json(authors)
//         });
//         // this.router.get("/author", (request: Request, response: Response)=>{
//         //     this.requests$.next({request, response});
//         //     Observable.of(Author.find({}).exec()).subscribe(async(authors)=>{
//         //         console.log(`Made a request to7: ${request.url}`);
//         //         const stuff = await authors;
//         //         response.json(stuff);
//         //     })
//         // });

//         // this.requests$.subscribe(async({request, response})=>{
//         //     const authors = await Author.find({}).lean().exec();
//         //     response.json(authors)
//         // });

//         /**
//          * @swagger
//          * /api/author:
//          *   post:
//          *     tags:
//          *      - Author
//          *     description:
//          *      Create new author.
//          *     produces:
//          *       - application/json
//          *     responses:
//          *       200:
//          *         description: Author
//          *       400:
//          *         description: Invalid request
//          *       403:
//          *         description: Forbidden
//          */
//         this.router.post("/author", async(request: Request, response: Response) => {

//             const author = await Author.create(request.body);

//             response.status(200).json(author);
//         });

//         return this.router;
//     }
// }