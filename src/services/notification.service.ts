import fs from 'fs';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';
import Handlebars from 'handlebars';
import twilio from 'twilio';
import serverConfig from '../config/sever.config';
import { IMailOptions, ISmsOptions } from '../interfaces/notification.interface';

class NotificationService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo> =
    createTransport({
      host: serverConfig.EMAIL_HOST,
      port: serverConfig.EMAIL_PORT,
      secure: true,
      auth: {
        user: serverConfig.EMAIL_USER,
        pass: serverConfig.EMAIL_PASSWORD,
      },
    });
	
  private client: twilio.Twilio = twilio(
    serverConfig.TWILIO_ACCOUNT_SID, 
    serverConfig.TWILIO_AUTH_TOKEN,
  );

  public async sendMail(options: IMailOptions) {
    const { templateName, replacements, to, from, subject } = options;
    const filePath = `./src/resources/mailTemplates/${templateName}.html`;
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = Handlebars.compile(source);
    const html = template(replacements);
    const mailData: Mail.Options = {
      from: `${from ? from : serverConfig.EMAIL_SENDER} <${
        serverConfig.EMAIL_USER
      }>`,
      to: to,
      subject: subject,
      html: html,
    };

    this.transporter.sendMail(mailData, (error: Error) => {
      if (error) {
        serverConfig.DEBUG(`Error sending email: ${error}`);
        return false;
      }
      return true;
    });
  }

  public async sendSms(options: ISmsOptions) {
    try {
      const opts = { from: serverConfig.TWILIO_NUMBER, ...options };
      await this.client.messages.create(opts);
    } catch (error) {
      serverConfig.DEBUG(`Error sending sms: ${error}`);
      return false;
    }
  }
}

export default new NotificationService();
