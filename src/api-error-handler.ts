import { NextFunction, Request, Response } from "@types/express";

export class ApiErrorHandler {
    public static HandleApiError(error: Error & { status: number }, request: Request, response: Response, next: NextFunction) {
        console.error(error.stack);
        if(!response.status) {response.status(error.status || 500);}

        //If there was an authentication errror.
        if (error.name == 'JWTExpressError') {
            response.status(401);
        }
        response.json({
            message: error.message || 'Server Error',
            status: error.status,
            URL: request.url,
            method: request.method,
            stack: error.stack,
            requestBody: request.body
        });
    }
}