import {  UserMI, IUser} from '../models/user';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from "./base/base.controller";

export class UserController extends BaseController<IUser> {
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
}
