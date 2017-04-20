import {  UserMI, IUser, UserModel} from '../models/user';
import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from "./base/base.controller";
var bcrypt = require('bcrypt');

export class UserController extends BaseController<IUser> {
  private saltRounds : Number = 10;
  public defaultPopulationArgument = 
    {
    path: 'roles',
    // Permissions for the roles
    populate: { path: 'permissions' }
  }

  constructor(){
    super();
    super.mongooseSchemaInstance = UserMI;
  }

  public create(request: Request, response: Response, next: NextFunction): Promise<any> {
    let user = <UserModel & IUser>new UserMI(request.body);
    return bcrypt.hash(user.passwordHash, this.saltRounds, (err, hash)=> {
      super.mongooseSchemaInstance['passwordHash'] = hash;
      return super.create(request,response,next, user);
    });
  }
}
