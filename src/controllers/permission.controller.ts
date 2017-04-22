import { PermissionComposite, IPermissionComposite } from '../models/permission';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { BaseController } from "./base/base.controller";

export class PermissionController extends BaseController<IPermissionComposite> {
  public defaultPopulationArgument = null;

  constructor() {
    super();
    super.mongooseModelInstance = PermissionComposite;
  }
}
