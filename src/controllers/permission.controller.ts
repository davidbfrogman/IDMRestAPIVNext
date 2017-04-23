import { PermissionComposite, IPermissionComposite } from '../models/permission';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from "./base/base.controller";
import { Constants } from "../constants";

export class PermissionController extends BaseController<IPermissionComposite> {
  public defaultPopulationArgument = null;

  constructor() {
    super();
    super.mongooseModelInstance = PermissionComposite;
  }

  public preCreateHook(model: IPermissionComposite): IPermissionComposite{
    model.href = `${Constants.APIEndpoint}${Constants.PermissionsEndpoint}/${model._id}`;
    return model;
  }

  public preUpdateHook(model: IPermissionComposite): IPermissionComposite{
    model.href = `${Constants.APIEndpoint}${Constants.PermissionsEndpoint}/${model._id}`;
    return model;
  }
}
