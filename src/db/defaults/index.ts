import * as fs from 'fs/promises';
import { State } from '../models/index';
import csvUtil from '../../utils/csv.util';

class DefaultData {
  constructor(
    private readonly models = {
      stateModel: State,
    },
  ) {}

  public async runDataMigration() {
    const dataSources = ['state'];

    await Promise.all([
      dataSources.map(async (dataSource) => {
        const data = await this.getData(dataSource);
        await this.models[`${dataSource}Model`].bulkCreate(data, {
          updateOnDuplicate: this.getUpdateFields(dataSource),
        });
      }),
    ]);
  }

  private getUpdateFields(dataSource: string) {
    const updateFieldsMap: { [key: string]: string[] } = {
      state: ['id'],
    };

    return updateFieldsMap[dataSource];
  }

  private async getData(name: string) {
    const fileBuffer = await this.convertToBuffer(
      `./src/resources/defaults/${name}.csv`,
    );

    return csvUtil.parseCsvFile(fileBuffer);
  }

  private async convertToBuffer(filePath: string) {
    try {
      const data = await fs.readFile(filePath);
      return data;
    } catch (error) {
      console.error(`Error converting file to buffer: ${error}`);
      return;
    }
  }
}

export default new DefaultData();
