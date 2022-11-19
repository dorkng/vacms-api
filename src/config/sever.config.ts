import { config } from 'dotenv';
import debug from 'debug';

config();

class ServerConfig {
  public DEBUG = debug('dev');
  
  public NODE_ENV = process.env.NODE_ENV;

  public PORT = process.env.PORT;

  public ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

  public DB_USERNAME = process.env.DB_USERNAME;

  public  DB_PASSWORD = process.env.DB_PASSWORD;

  public DB_HOST = process.env.DB_HOST;

  public  DB_PORT = Number(process.env.DB_PORT);

  public  DB_NAME = process.env.DB_NAME;
}

export default new ServerConfig();