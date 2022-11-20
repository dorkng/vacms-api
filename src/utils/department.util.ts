import Joi from 'joi';

class DepartmentUtil {
  public creationSchema = Joi.object().keys({
    name: Joi.string().required().label('Department Name'),
  });
}

export default new DepartmentUtil();