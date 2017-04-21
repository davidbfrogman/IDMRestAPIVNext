import { IUserMongooseComposite, UserMongooseComposite, IUser } from '../models/user';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from "./base/base.controller";
var bcrypt = require('bcrypt');

export class UserController extends BaseController<IUserMongooseComposite> {
  private saltRounds : Number = 10;
  public defaultPopulationArgument = 
    {
    path: 'roles',
    // Permissions for the roles
    populate: { path: 'permissions' }
  }

  constructor(){
    super();
    super.mongooseModelInstance = UserMongooseComposite;
  }

  public create(request: Request, response: Response, next: NextFunction): Promise<any> {
    let user:IUser = <IUser>request.body;
    return bcrypt.hash(user.passwordHash, this.saltRounds, (err, hash)=> {
      user.passwordHash = hash;
      request.body = user;  //If we push this back onto the request, then the rest of our architecture will just work. 
      super.create(request,response,next);
    });
  }
}
