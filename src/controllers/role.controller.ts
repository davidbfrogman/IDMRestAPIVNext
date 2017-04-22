import { IRoleComposite, RoleComposite } from '../models/role';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from "./base/base.controller";

export class RoleController extends BaseController<IRoleComposite> {
  public defaultPopulationArgument =
  {
    path: 'permissions'
  }

  constructor() {
    super();
    super.mongooseModelInstance = RoleComposite;
  }
}
