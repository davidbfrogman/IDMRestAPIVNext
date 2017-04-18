import * as express from 'express';
import * as http from 'http';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as fs from 'fs';
import { join } from 'path';
import { json, urlencoded } from 'body-parser';
import { mongoose } from './config/database';
import methodOverride = require('method-override');
import log = require('winston');
 
// Router Imports ======================================================
import { DocumentTemplateRouter } from './routes/document-template.router';
import { APIDocsRouter } from './routes/swagger';

log.remove(log.transports.Console);
log.add(log.transports.Console, {colorize: true});

const port = process.env.PORT || 8080;        // set our port

log.info('Starting up Express Server.');
const app: express.Application = express();

// Middleware ==========================================================
log.info('Initializing Middleware');
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
app.use(morgan('dev')); //Using morgan middleware for logging all requests.

// Routers =============================================================
log.info('Initializing Routers');
app.use('/api', new DocumentTemplateRouter().getRouter());
app.use('/api-docs', express.static(__dirname + '/swagger/swagger-ui'));
app.use('/swagger-definition', express.static(__dirname + '/swagger/'));

// Homepage ============================================================
app.get('/', (request: express.Request, response: express.Response) => {
    response.json({
        name: 'IDM REST API',
        DocumentationLocation: 'http://localhost:8080/api-docs'
    })
});

// Catch all handler ===================================================
app.get('*', function(req, res, next) {
  var err = new Error(`No router was found for your request, page not found.  Requested Page: ${req.originalUrl}`);
  err['status'] = 404;
  next(err);
});

// Error handler.  Must go at end of server stack.======================
log.info('Instantiating Default Error Handler Route');
app.use((error: Error & { status: number }, request: express.Request, response: express.Response, next: express.NextFunction): void => {
    console.error(error.stack)
    response.status(error.status || 500);
    response.json({
        message: error.message || 'Server Error',
        status: error.status,
        URL: request.url,
        stack: error.stack,
        requestBody: request.body
    });
});

const server: http.Server = app.listen(port);
log.info(`Listening on http://localhost:${port}`);

// Unhandled rejections are when promises don't use a 'catch' but somehow exit.
// This happens a lot in the database layer, where you have an error handler that calls 'next' and bypasses 
// the gc for promises.  At some point you might want to look into cleaning that up.  
// if needed you can add .catch(()=>{}) which will completely swallow the unhandled promise rejection.  This felt dirty. 
// This will prevent the server from becoming unstable.  Error happens, it's caught here, and server still runs.
process.on('unhandledRejection', (reason, p) => {
  //log.info('Unhandled Promise Rejection Promise Location: ', p);
  log.info('Unhandled Promise Rejection - Could Be Dangerous See server.js for more details \n Promise Rejection Reason:', reason);
});

export { server };