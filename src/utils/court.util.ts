import Joi from 'joi';

class CourtUtil {
  public courtCreationSchema = Joi.object().keys({
    name: Joi.string().required().label('Court Name'),
    typeId: Joi.number().required().label('Court Type'),
    addressId: Joi.number().required().label('Court Address'),
    numberOfCourtRooms: Joi.number().required().label('Number of Court Rooms'),
    chiefRegistrar: Joi.string()
      .optional()
      .allow('', null)
      .label('Chief Registrar'),
  });

  public courtBulkCreationSchema = Joi.array().items(
    Joi.object().keys({
      Name: Joi.string().required().label('Court Name'),
      Type: Joi.string().required().label('Court Type'),
      State: Joi.string().required().label('Court State'),
    }),
  );

  public courtUpdateSchema = Joi.object().keys({
    name: Joi.string().optional().label('Court Name'),
    typeId: Joi.number().optional().label('Court Type'),
    addressId: Joi.number().optional().label('Court Address'),
    numberOfCourtRooms: Joi.number().optional().label('Number of Court Rooms'),
    chiefRegistrar: Joi.string()
      .optional()
      .allow('', null)
      .label('Chief Registrar'),
  });

  public courtTypeCreationSchema = Joi.object().keys({
    name: Joi.string().required().label('Court Type'),
    logoUrl: Joi.string().allow('', null).label('Logo'),
  });

  public courtTypeUpdateSchema = Joi.object().keys({
    name: Joi.string().optional().label('Court Type'),
    logoUrl: Joi.string().allow('', null).label('Logo'),
  });

  public courtAddressCreationSchema = Joi.object().keys({
    street: Joi.string().required().label('Street'),
    city: Joi.string().required().label('City'),
    stateId: Joi.number().min(1).required().label('State'),
  });

  public courtAddressUpdateSchema = Joi.object().keys({
    street: Joi.string().label('Street'),
    city: Joi.string().label('City'),
    stateId: Joi.number().min(1).label('State'),
  });
}

export default new CourtUtil();
