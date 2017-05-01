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
import { ApiErrorHandler } from './api-error-handler';
import { UserRouter } from './routes/user.router';
import { Config } from './config/config';
import { AuthenticationRouter } from './routes/authentication.router';
import { Router } from 'express';
import { RoleRouter } from "./routes/role.router";
import { PermissionRouter } from "./routes/permission.router";
import { DocumentEntityRouter } from "./routes/document-entity.router";
import { EnterpriseEnumerationRouter } from "./routes/enterprise-enumeration.router";
import { Constants } from "./constants";


log.info('Starting up Express Server.');
const app: express.Application = express();

if(Config.currentConfig().isConsoleLoggingActive){
    log.remove(log.transports.Console);
    log.add(log.transports.Console, { colorize: true });
    app.use(morgan('dev')); //Using morgan middleware for logging all requests.
}
else{
    log.remove(log.transports.Console);
}

const port = Config.currentConfig().port;        // set our port

// Authentication========================================================
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
app.set('jwtSecretToken', Config.currentConfig().jwtSecretToken);

// Middleware ==========================================================
log.info('Initializing Middleware');
app.use(json());
app.use(urlencoded({
    extended: true
}));
app.use(methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
// compress all requests
app.use(compression());


// Routers =============================================================
log.info('Initializing Routers');
app.use('/authenticate', new AuthenticationRouter().getRouter());
//Commenting out authentication for development
//app.use('/api*', new AuthenticationRouter().authenticationRequestValidation);

app.use(Constants.APIEndpoint, new DocumentTemplateRouter().getRouter());
app.use(Constants.APIEndpoint, new DocumentEntityRouter().getRouter());
app.use(Constants.APIEndpoint, new EnterpriseEnumerationRouter().getRouter());
app.use(Constants.AdminEndpoint, new UserRouter().getRouter());
app.use(Constants.AdminEndpoint, new RoleRouter().getRouter());
app.use(Constants.AdminEndpoint, new PermissionRouter().getRouter());
app.use(Constants.APIDocsEndpoint, express.static(__dirname + '/swagger/swagger-ui'));
app.use(Constants.APISwaggerDefinitionEndpoint, express.static(__dirname + '/swagger/'));

// Homepage ============================================================
app.get('/', (request: express.Request, response: express.Response) => {
    response.json({
        name: 'IDM REST API',
        DocumentationLocation: 'http://localhost:8080/api-docs',
        APILocation: 'http://localhost:8080/api',
        AuthenticationEndpoint: 'http://localhost:8080/api/authenticate',
    })
});

// Catch all handler ===================================================
app.get('*', function (req, res, next) {
    var err = new Error(`No router was found for your request, page not found.  Requested Page: ${req.originalUrl}`);
    err['status'] = 404;
    next(err);
});

// Error handler.  Must go at end of server stack.======================
log.info('Instantiating Default Error Handler Route');
app.use((error: Error & { status: number }, request: express.Request, response: express.Response, next: express.NextFunction): void => {
    ApiErrorHandler.HandleApiError(error, request, response, next);
});

const server: http.Server = app.listen(port);
log.info(`Listening on http://localhost:${port}`);

// Unhandled rejections are when promises don't use a 'catch' but somehow exit.
// This happens a lot in the database layer, where you have an error handler that calls 'next' and bypasses 
// the gc for promises.  At some point you might want to look into cleaning that up.  
// if needed you can add .catch(()=>{}) which will completely swallow the unhandled promise rejection.  This felt dirty. 
// This will prevent the server from becoming unstable.  Error happens, it's caught here, and server still runs.
process.on('unhandledRejection', (reason, p) => {
    log.error('Unhandled Promise Rejection - Could Be Dangerous See server.js for more details \n Promise Rejection Reason:', reason);
});

process.on('uncaughtException', (error)=> {
      log.error('Uncaught exception was not handled by code base, server restarting to maintain stability:', error);
      log.error('Uncaught exception StackTrace:', error.stack);
      // Because we should be running with forever or nodemon, we can exit the process, and they will restart for us.
      // If you don't exit the process, you leave the app in an inconsistent state, with no idea what might happen.
      process.exit(1);
});

export { server };