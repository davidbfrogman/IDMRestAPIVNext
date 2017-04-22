import { EnterpriseEnumerationComposite, IEnterpriseEnumeration } from '../models/enterprise-enumeration';
import { BaseController } from './base/base.controller';

export class EnterpriseEnumerationController extends BaseController<IEnterpriseEnumeration> {
  public defaultPopulationArgument = null;

  constructor() {
    super();
    super.mongooseModelInstance = EnterpriseEnumerationComposite;
  }
}
