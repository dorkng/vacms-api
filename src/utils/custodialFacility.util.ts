import Joi from 'joi';

class CustodialFacilityUtil {
  public custodialFacilityCreationSchema = Joi.object().keys({
    name: Joi.string().required().label('Custodial Facility Name'),
    capacity: Joi.number()
      .min(0)
      .required()
      .label('Custodial Facility Capacity'),
    stateId: Joi.number().required().label('State'),
  });

  public custodialFacilityBulkCreationSchema = Joi.array().items(
    Joi.object().keys({
      Name: Joi.string().required().label('Custodial Facility Name'),
      Capacity: Joi.number()
        .min(0)
        .required()
        .label('Custodial Facility Capacity'),
      State: Joi.string().required().label('State'),
    }),
  );

  public custodialFacilityUpdateSchema = Joi.object().keys({
    name: Joi.string().label('Custodial Facility Name'),
    capacity: Joi.number().min(0).label('Custodial Facility Capacity'),
    stateId: Joi.number().label('State'),
  });
}

export default new CustodialFacilityUtil();
