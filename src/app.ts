import * as express from "express";
import { json, urlencoded } from "body-parser";
import * as http from "http";
import * as compression from "compression";
import * as morgan from "morgan";

var logger = morgan('combined');
var port = process.env.PORT || 8080;        // set our port

process.env.NODE_ENV = "testing";

// import { PostRouter } from "./routes/post/post";
// import { AuthorRouter } from "./routes/author/author";
import { DocumentTemplateRouter } from "./routes/document-template.router";
import { APIDocsRouter } from "./routes/swagger";

const app: express.Application = express();

app.use(json());
app.use(urlencoded({
    extended: true
}));

app.use(
    morgan('dev', {
        skip: function (req, res) { return req.url.indexOf('.jpg') != -1; }
    })
);

app.get("/", (request: express.Request, response: express.Response) => {
    response.json({
        name: "IDM REST API"
    })
});

app.use((err: Error & { status: number }, request: express.Request, response: express.Response, next: express.NextFunction): void => {

    response.status(err.status || 500);
    response.json({
        error: "Server error"
    })
});

app.use("/api", new DocumentTemplateRouter().getRouter());
app.use("/api/docs", new APIDocsRouter().getRouter());

const server: http.Server = app.listen(3003);

console.log(`Listening on http://localhost:3003`);

export { server };