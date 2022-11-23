import { config } from 'dotenv';
import debug from 'debug';

config();

class ServerConfig {
  public DEBUG = debug('dev');
  
  public NODE_ENV = process.env.NODE_ENV;

  public PORT = process.env.PORT;

  public ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

  public BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

  public AUTH_SECRET = process.env.AUTH_SECRET;

  public JWT_EXPIRATION = process.env.JWT_EXPIRATION;

  public DB_USERNAME = process.env.DB_USERNAME;

  public DB_PASSWORD = process.env.DB_PASSWORD;

  public DB_HOST = process.env.DB_HOST;

  public DB_PORT = Number(process.env.DB_PORT);

  public DB_NAME = process.env.DB_NAME;

  public TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;

  public TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

  public TWILIO_NUMBER = process.env.TWILIO_NUMBER;

  public EMAIL_HOST = process.env.EMAIL_HOST;

  public EMAIL_PORT = Number(process.env.EMAIL_PORT);

  public EMAIL_USER = process.env.EMAIL_USER;

  public EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

  public EMAIL_SENDER = process.env.EMAIL_SENDER;

  public FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

  public FILE_STORAGE_PATH = process.env.FILE_STORAGE_PATH;
}

export default new ServerConfig();