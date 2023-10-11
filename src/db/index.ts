import { Sequelize, Options } from 'sequelize';
import { init as initModels } from './models';
import serverConfig from '../config/server.config';

class DB {
  public sequelize: Sequelize;
  
  async connectDB() {
    try {
      const options: Options = {
        logging: serverConfig.NODE_ENV === 'development' ? console.log : false,
        dialect: 'mysql',
        host: serverConfig.DB_HOST,
        username: serverConfig.DB_USERNAME,
        password: serverConfig.DB_PASSWORD,
        port: serverConfig.DB_PORT,
        database: serverConfig.DB_NAME,
      };
      this.sequelize = new Sequelize(
        serverConfig.DB_NAME,
        serverConfig.DB_USERNAME,
        serverConfig.DB_PASSWORD,
        options,
      );
      initModels(this.sequelize);
      if (serverConfig.NODE_ENV === 'development') {
        // await this.sequelize.sync({ alter: true });
        // await this.sequelize.sync({ force: true });
        await this.sequelize.sync();
      }
      serverConfig.DEBUG('Connected to database.');
      return this.sequelize;
    } catch (error) {
      serverConfig.DEBUG(`Failed to connect to database: ${error}`);
      throw error;
    }
  }
}
  
export default new DB();
