import { EnterpriseEnumerationComposite, IEnterpriseEnumeration } from '../models/enterprise-enumeration';
import { BaseController } from './base/base.controller';
import { Constants } from "../constants";
var Promise = require("bluebird");

export class EnterpriseEnumerationController extends BaseController<IEnterpriseEnumeration> {
  public defaultPopulationArgument = null;

  constructor() {
    super();
    super.mongooseModelInstance = EnterpriseEnumerationComposite;
  }

  public preCreateHook(model: IEnterpriseEnumeration): Promise<IEnterpriseEnumeration>{
    model.href = `${Constants.APIEndpoint}${Constants.EnterpriseEnumerationsEndpoint}/${model._id}`;
    return Promise.resolve(model);
  }

  public preUpdateHook(model: IEnterpriseEnumeration): Promise<IEnterpriseEnumeration>{
    model.href = `${Constants.APIEndpoint}${Constants.EnterpriseEnumerationsEndpoint}/${model._id}`;
    return Promise.resolve(model);
  }
}
