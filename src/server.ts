import * as express from 'express';
import * as http from 'http';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as fs from 'fs';
import { join } from 'path';
import { json, urlencoded } from 'body-parser';
import mongoose = require('mongoose');
import methodOverride = require('method-override');
 
// Router Imports ======================================================
import { DocumentTemplateRouter } from './routes/document-template.router';
import { APIDocsRouter } from './routes/swagger';

const port = process.env.PORT || 8080;        // set our port
const app: express.Application = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

// Middleware ==========================================================
app.use(json());
app.use(urlencoded({
    extended: true
}));
app.use(methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
// compress all requests
app.use(compression());
app.use(morgan('dev'));

// Routers =============================================================
app.use('/api', new DocumentTemplateRouter().getRouter());

//var css = fs.readFileSync(__dirname + '/swagger/swagger-ui.css');
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,true, null, css.toString(), null));
app.use('/api-docs', express.static(__dirname + '/swagger/swagger-ui'));
app.use('/swagger', express.static(__dirname + '/swagger/'));
//app.use(express.static(__dirname + '/public'));

// Homepage ============================================================
app.get('/', (request: express.Request, response: express.Response) => {
    response.json({
        name: 'IDM REST API'
    })
});

// Catcha all handler ===================================================
app.get('*', function(req, res, next) {
  var err = new Error('No router was found for your request, page not found.');
  err['status'] = 404;
  next(err);
});

// Error handler.  Must go at end of server stack.======================
app.use((error: Error & { status: number }, request: express.Request, response: express.Response, next: express.NextFunction): void => {
    console.error(error.stack)
    response.status(error.status || 500);
    response.json({
        message: error.message || 'Server Error',
        status: error.status,
        URL: request.url,
        response: 'There was something wrong with your request',
        stack: error.stack,
        body: request.body
    });
});

const server: http.Server = app.listen(port);
console.log(`Listening on http://localhost:${port}`);

export { server };