import { IUserComposite, UserComposite } from '../models/user';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler, Application } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from './base/base.controller';
import { Config } from '../config/config';
import { ITokenPayload } from "../models/token-payload";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export class AuthenticationController extends BaseController<IUserComposite> {

    private saltRounds: Number = 5;
    private tokenExpiration: string = '1h';
    public defaultPopulationArgument = null;

    constructor() {
        super();
        super.mongooseModelInstance = UserComposite;
    }

    public authenticate(request: Request, response: Response, next: NextFunction): Promise<any> {
        return this.mongooseModelInstance.findOne({ username: request.body.username })
            .select('+passwordHash')
            .then((user) => {
                bcrypt.compare(request.body.passwordHash, user.passwordHash, (err, res) => {
                    if (err) {
                        this.sendAuthFailure(response, 401, err);
                    }
                    if (res === false) {
                        this.sendAuthFailure(response, 401, 'Password does not match');
                    }
                    else {

                        let tokenPayload: ITokenPayload = {
                            userId: user._id,
                            expiration: this.tokenExpiration
                        };

                        let token = jwt.sign(tokenPayload, Config.currentConfig().jwtSecretToken, {
                            expiresIn: tokenPayload.expiration
                        });

                        response.json({
                            authenticated: true,
                            message: 'Successfully created jwt authentication token.',
                            expiresIn: tokenPayload.expiration,
                            token: token,
                        });
                    }
                });
            })
            .catch((error) => { next(error); });
    }

    /*
        1.  Issue JWT token with relatively short expiry, say 15min.    
        2.  Application checks token expiry date before any transaction requiring a token (token contains expiry date). If token has expired, then it first asks API to 'refresh' the token (this is done transparently to the UX).
        3.  API gets token refresh request, but first checks user database to see if a 'reauth' flag has been set against that user profile (token can contain user id). If the flag is present, then the token refresh is denied, otherwise a new token is issued.
    */
    public refreshToken(request: Request, response: Response, next: NextFunction): void {
        let token = request.body.token || request.query.token || request.headers['x-access-token'];
        // so you're going to get a request with a valid token, that hasn't expired yet
        // and you're going to return a new token with a new expiration date 
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, Config.currentConfig().jwtSecretToken, (err, decodedToken: ITokenPayload) => {
                if (err) {
                    this.sendAuthFailure(response, 401, 'Failed to authenticate token. The timer *may* have expired on this token.');
                } else {
                    //get the user from the database, and verify that they don't need to re login
                    this.mongooseModelInstance.findById(decodedToken.userId).then((user) => {
                        if (user.isTokenExpired) {
                            this.sendAuthFailure(response, 401, 'The user must login again to refresh their credentials');
                        }
                        else {

                            let tokenPayload: ITokenPayload = {
                                userId: user._id,
                                expiration: this.tokenExpiration
                            };

                            let newToken = jwt.sign(tokenPayload, Config.currentConfig().jwtSecretToken, {
                                expiresIn: tokenPayload.expiration
                            });

                            response.json({
                                authenticated: true,
                                message: 'Successfully refreshed jwt authentication token.',
                                expiresIn: tokenPayload.expiration,
                                token: newToken,
                            });
                        }
                    }).catch((error) => { next(error) });
                }
            });
        }
        else {
            // If we don't have a token, return a failure
            this.sendAuthFailure(response, 403, 'No Authentication Token Provided');
        }
    }

    public authenticationRequestValidation(request: Request, response: Response, next: NextFunction): Response {
        let token = request.body.token || request.query.token || request.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, Config.currentConfig().jwtSecretToken, (err, decodedToken) => {
                if (err) {
                    return this.sendAuthFailure(response, 401, 'Failed to authenticate token. The timer *may* have expired on this token.');
                } else {
                    // if everything is good, save to request for use in other routes
                    request['decodedToken'] = decodedToken;
                    next();
                }
            });
        } else {
            //No token, send auth failure
            return this.sendAuthFailure(response, 403, 'No Authentication Token Provided');
        }
    }

    public sendAuthFailure(response: Response, status: number, description: string): Response {
        return response.status(status).json({
            message: 'Authentication Failed',
            description: description
        });
    }
}
