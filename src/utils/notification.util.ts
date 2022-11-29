import { User, UserVerification } from '../db/models';
import userService from '../services/user.service';
import notificationService from '../services/notification.service';
import { IMailOptions, ISmsOptions } from '../interfaces/notification.interface';
import serverConfig from '../config/server.config';

class NotificationUtil {
  public async sendAccountCreationMail(user: User): Promise<void> {
    const { id, email, firstName } = user;
    const token = await userService.generateVerificationToken(id);
    const options: IMailOptions = {
      to: email,
      subject: 'Account Creation',
      templateName: 'accountCreation',
      replacements: { 
        email, firstName,
        link: `${serverConfig.FRONTEND_BASE_URL}/verify?uid=${id}&token=${token}`,
      },
    };
    await notificationService.sendMail(options);
  }

  public async sendOtpNotification(user: User, verification: UserVerification): Promise<void> {
    // await this.sendOtpSms(user, verification);
    await this.sendOtpMail(user, verification);
  }

  private async sendOtpSms(user: User, verification: UserVerification): Promise<void> {
    const { otp } = verification;
    const [countryCode, number] = user.phoneNumber.split('-');
    const to = `${countryCode.trim()}${number.trim()}`;
    const body = `Your One Time Password (OTP) to complete your login to the VACMS is ${otp}. Kindly complete the login process with this token. Please note that the OTP expires in 5 minutes.`;
    const options: ISmsOptions = { to, body };
    await notificationService.sendSms(options);
  }

  private async sendOtpMail(user: User, verification: UserVerification): Promise<void> {
    const { otp } = verification;
    const { email, firstName, lastName } = user;
    const fullName = `${firstName} ${lastName}`.toUpperCase();
    const options: IMailOptions = {
      to: email,
      subject: 'VACMS: 2-Step Verification',
      templateName: 'twoFactorVerification',
      replacements: { fullName, otp },
    };
    await notificationService.sendMail(options);
  }

  public async sendForgotPasswordMail(user: User): Promise<void> {
    const { id, email, firstName } = user;
    const token = await userService.generateVerificationToken(id);
    const options: IMailOptions = {
      to: email,
      subject: 'Reset my Password',
      templateName: 'forgotPassword',
      replacements: { 
        email, firstName,
        link: `${serverConfig.FRONTEND_BASE_URL}/reset-password?uid=${id}&token=${token}`,
      },
    };
    await notificationService.sendMail(options);
  }
}

export default new NotificationUtil();