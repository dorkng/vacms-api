import { WhereOptions, InferAttributes, Op } from 'sequelize';
import { ProsecutingAgency, State } from '../db/models';
import { ConflictError, NotFoundError } from '../errors';
import { QueryOptions } from '../interfaces/functions.interface';
import prosecutingAgencyUtil from '../utils/prosecutingAgency.util';
import stateService from './state.service';
import csvUtil from '../utils/csv.util';
import { CsvFileParseType } from '../interfaces/csv.interface';
import helperUtil from '../utils/helper.util';

class ProsecutingAgencyService {
  private prosecutingAgencyModel = ProsecutingAgency;

  private defaultIncludeable = [{ model: State, as: 'state' }];

  public async create(data: unknown): Promise<ProsecutingAgency> {
    const { name, jurisdiction, stateId } =
      await prosecutingAgencyUtil.prosecutingAgencyCreationSchema.validateAsync(
        data,
      );

    await stateService.getById(stateId);

    const attributes = { name, jurisdiction, stateId, label: undefined };

    const prosecutingAgency = await this.prosecutingAgencyModel.create(
      attributes,
    );

    return prosecutingAgency.reload({ include: this.defaultIncludeable });
  }

  public async bulkCreate(file: Buffer): Promise<void> {
    const parsedData = await csvUtil.parseCsvFile(
      file,
      CsvFileParseType.PROSECUTING_AGENCY,
    );

    const validatedData =
      await prosecutingAgencyUtil.prosecutingAgencyBulkCreationSchema.validateAsync(
        parsedData,
      );

    const bulkAttributes = [];

    for (const data of validatedData) {
      const { Name, Jurisdiction, State: givenStateName } = data;

      const retrievedState = await stateService.getByName(givenStateName);

      if (retrievedState) {
        bulkAttributes.push({
          name: Name,
          jurisdiction: Jurisdiction,
          stateId: retrievedState.id,
          label: undefined,
        });
      }
    }

    if (bulkAttributes.length === 0) {
      throw new ConflictError('No prosecuting agency added.');
    }

    await this.prosecutingAgencyModel.bulkCreate(bulkAttributes, {
      updateOnDuplicate: ['jurisdiction', 'stateId'],
    });
  }

  public async get(id: number): Promise<ProsecutingAgency> {
    const prosecutingAgency = await this.prosecutingAgencyModel.findByPk(id, {
      include: this.defaultIncludeable,
    });

    if (!prosecutingAgency) {
      throw new NotFoundError('Prosecuting agency not found.');
    }

    return prosecutingAgency;
  }

  public async getByName(name: string): Promise<State> {
    const label = helperUtil.getLabel(name);

    return this.prosecutingAgencyModel.findOne({
      where: { label },
    });
  }

  public async getAll(
    opts: QueryOptions,
  ): Promise<{ result: ProsecutingAgency[]; totalCount: number }> {
    const { limit, offset, search } = opts;

    const where: WhereOptions<
    InferAttributes<ProsecutingAgency, { omit: never }>
    > = {
      [Op.or]: {
        name: { [Op.like]: search ? `%${search}%` : '%' },
      },
    };

    const { rows, count } = await this.prosecutingAgencyModel.findAndCountAll({
      where: where,
      include: this.defaultIncludeable,
      limit: limit,
      offset: offset,
      order: [['name', 'ASC']],
    });

    return { result: rows, totalCount: count };
  }

  public async update(id: number, data: unknown): Promise<ProsecutingAgency> {
    const { name, jurisdiction, stateId } =
      await prosecutingAgencyUtil.prosecutingAgencyUpdateSchema.validateAsync(
        data,
      );

    const prosecutingAgency = await this.get(id);

    if (stateId) await stateService.getById(stateId);

    let label: string;

    if (name) label = helperUtil.getLabel(name);

    const attributes = { name, jurisdiction, stateId, label };

    await prosecutingAgency.update(attributes);
    return prosecutingAgency.reload();
  }

  public async delete(id: number): Promise<ProsecutingAgency> {
    const prosecutingAgency = await this.get(id);

    await prosecutingAgency.destroy();

    return prosecutingAgency;
  }
}

export default new ProsecutingAgencyService();
