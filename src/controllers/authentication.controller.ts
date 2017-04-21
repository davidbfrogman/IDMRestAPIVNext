import { IUserMongooseComposite, UserMongooseComposite } from '../models/user';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler, Application } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from './base/base.controller';
import { config } from '../config/config';

const jwt = require('jsonwebtoken');

export class AuthenticationController extends BaseController<IUserMongooseComposite> {

    tokenExpiration: String = '1d';
  public defaultPopulationArgument = null;

    constructor() {
        super();
        super.mongooseModelInstance = UserMongooseComposite;
    }

    public authenticate(request: Request, response: Response, next: NextFunction): Promise<any> {
        return this.mongooseModelInstance
            .findOne({
                username: request.body.username
            }).then((user) => {
                //hash the password we recieved from the body
                if (user.passwordHash !== request.body.passwordHash) {
                    response.status(401).json({
                        message: 'Authentication Failed',
                        description: 'Password does not match'
                    })
                }
                else {
                    var token = jwt.sign(user._id, config.devConfig.jwtSecretToken, {
                        expiresIn: this.tokenExpiration // expires in 1 day
                    });

                    response.json({
                        authenticated: true,
                        message: 'Successfully created jwt authentication token.',
                        expiresIn: this.tokenExpiration,
                        token: token,
                    })
                }

            })
            .catch((error) => { next(error); });
    }

    public authenticationRequestValidation(request: Request, response: Response, next: NextFunction): Response {
        var token = request.body.token || request.query.token || request.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.devConfig.jwtSecretToken, function (err, decodedToken) {
                if (err) {
                    return response.status(401).json({
                        message: 'Authentication Failed',
                        description: 'Failed to authenticate token. The timer *may* have expired on this token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    request['decodedToken'] = decodedToken;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            return response.status(403).json({
                message: 'Authentication Failed',
                description: 'No Authentication Token Provided'
            });

        }
    }
}
