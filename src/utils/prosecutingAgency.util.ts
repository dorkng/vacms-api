import Joi from 'joi';
import { JurisdictionType } from '../interfaces/prosecutingAgency.interface';

class ProsecutingAgencyUtil {
  public prosecutingAgencyCreationSchema = Joi.object().keys({
    name: Joi.string().required().label('Prosecuting Agency Name'),
    jurisdiction: Joi.string()
      .valid(...Object.values(JurisdictionType))
      .required()
      .label('Jurisdiction'),
    stateId: Joi.number().required().label('State'),
  });

  public prosecutingAgencyBulkCreationSchema = Joi.array().items(
    Joi.object().keys({
      Name: Joi.string().required().label('Prosecuting Agency Name'),
      Jurisdiction: Joi.string()
        .lowercase()
        .valid(...Object.values(JurisdictionType))
        .required()
        .label('Jurisdiction'),
      State: Joi.string().required().label('State'),
    }),
  );

  public prosecutingAgencyUpdateSchema = Joi.object().keys({
    name: Joi.string().label('Prosecuting Agency Name'),
    jurisdiction: Joi.string()
      .valid(...Object.values(JurisdictionType))
      .label('Jurisdiction'),
    stateId: Joi.number().label('State'),
  });
}

export default new ProsecutingAgencyUtil();
