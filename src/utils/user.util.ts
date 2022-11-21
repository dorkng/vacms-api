import crypto from 'crypto';
import Joi from 'joi';
import moment from 'moment';

class UserUtil {
  public creationSchema = Joi.object().keys({
    email: Joi.string().email().required().label('User Email'),
    firstName: Joi.string().required().label('User First Name'),
    lastName: Joi.string().required().label('User Last Name'),
    phoneNumber: Joi.string().required().label('User Phone Number'),
    access: Joi.object()
      .keys({
        accessLevel: Joi.string()
          .valid(
            ...[
              'registerer',
              'lawyer',
              'director',
              'permanent-secretary',
              'attorney-general',
            ],
          )
          .label('User Access Level'),
        departmentId: Joi.number().allow('', null).optional().label('Department'),
      })
      .required()
      .label('User Access'),
  });

  public changePasswordSchema = Joi.object().keys({
    currentPassword: Joi.string().required().label('Current Password'),
    newPassword: Joi.string().min(8).required().label('New Password'),
    confirmPassword: Joi.ref('newPassword'),
  });

  public validateUserPassword = Joi.object().keys({
    password: Joi.string().min(8).required().label('Password'),
    confirmPassword: Joi.ref('password'),
  });

  public generateRandomPassword() {
    return crypto.randomBytes(16).toString('base64');
  }

  public generateOtp() {
    return  Math.random().toString().slice(3, 9);
  }

  public getOtpExpiration() {
    const now = new Date(Date.now());
    return moment(now).add(5, 'minutes').toDate();
  }
}

export default new UserUtil();
