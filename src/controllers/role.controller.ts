import { IRoleComposite, RoleComposite } from '../models/role';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from "./base/base.controller";
import { Constants } from "../constants";

export class RoleController extends BaseController<IRoleComposite> {
  public defaultPopulationArgument =
  {
    path: 'permissions'
  }

  constructor() {
    super();
    super.mongooseModelInstance = RoleComposite;
  }

  public preCreateHook(model: IRoleComposite): IRoleComposite{
    model.href = `${Constants.APIEndpoint}${Constants.RolesEndpoint}/${model._id}`;
    return model;
  }

  public preUpdateHook(model: IRoleComposite): IRoleComposite{
    model.href = `${Constants.APIEndpoint}${Constants.RolesEndpoint}/${model._id}`;
    return model;
  }
}
