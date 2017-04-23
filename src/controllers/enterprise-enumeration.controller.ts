import { EnterpriseEnumerationComposite, IEnterpriseEnumeration } from '../models/enterprise-enumeration';
import { BaseController } from './base/base.controller';
import { Constants } from "../constants";

export class EnterpriseEnumerationController extends BaseController<IEnterpriseEnumeration> {
  public defaultPopulationArgument = null;

  constructor() {
    super();
    super.mongooseModelInstance = EnterpriseEnumerationComposite;
  }

  public preCreateHook(model: IEnterpriseEnumeration): IEnterpriseEnumeration{
    model.href = `${Constants.APIEndpoint}${Constants.EnterpriseEnumerationsEndpoint}/${model._id}`;
    return model;
  }

  public preUpdateHook(model: IEnterpriseEnumeration): IEnterpriseEnumeration{
    model.href = `${Constants.APIEndpoint}${Constants.EnterpriseEnumerationsEndpoint}/${model._id}`;
    return model;
  }
}
