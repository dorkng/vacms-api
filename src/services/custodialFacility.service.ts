import { WhereOptions, InferAttributes, Op } from 'sequelize';
import { CustodialFacility, State } from '../db/models';
import { NotFoundError } from '../errors';
import { QueryOptions } from '../interfaces/functions.interface';
import custodialFacilityUtil from '../utils/custodialFacility.util';
import stateService from './state.service';
import csvUtil from '../utils/csv.util';
import { CsvFileParseType } from '../interfaces/csv.interface';
import helperUtil from '../utils/helper.util';

class CustodialFacilityService {
  private custodialFacilityModel = CustodialFacility;

  private defaultIncludeable = [{ model: State, as: 'state' }];

  public async create(data: unknown): Promise<CustodialFacility> {
    const { name, capacity, stateId } =
      await custodialFacilityUtil.custodialFacilityCreationSchema.validateAsync(
        data,
      );

    await stateService.getById(stateId);

    const attributes = { name, capacity, stateId, label: undefined };

    const custodialFacility = await this.custodialFacilityModel.create(
      attributes,
    );

    return custodialFacility.reload({ include: this.defaultIncludeable });
  }

  public async bulkCreate(file: Buffer): Promise<void> {
    const parsedData = await csvUtil.parseCsvFile(
      file,
      CsvFileParseType.CUSTODIAL_FACILITY,
    );

    const validatedData =
      await custodialFacilityUtil.custodialFacilityBulkCreationSchema.validateAsync(
        parsedData,
      );

    const bulkAttributes = [];

    for (const data of validatedData) {
      const { Name, Capacity, State: givenStateName } = data;

      const retrievedState = await stateService.getByName(givenStateName);

      if (retrievedState) {
        bulkAttributes.push({
          name: Name,
          capacity: Capacity,
          stateId: retrievedState.id,
          label: undefined,
        });
      }
    }

    await this.custodialFacilityModel.bulkCreate(bulkAttributes, {
      updateOnDuplicate: ['capacity', 'stateId'],
    });
  }

  public async get(id: number): Promise<CustodialFacility> {
    const custodialFacility = await this.custodialFacilityModel.findByPk(id, {
      include: this.defaultIncludeable,
    });

    if (!custodialFacility) {
      throw new NotFoundError('Custodial facility not found.');
    }

    return custodialFacility;
  }

  public async getByName(name: string): Promise<State> {
    const label = helperUtil.getLabel(name);

    return this.custodialFacilityModel.findOne({
      where: { label },
    });
  }

  public async getAll(
    opts: QueryOptions,
  ): Promise<{ result: CustodialFacility[]; totalCount: number }> {
    const { limit, offset, search } = opts;

    const where: WhereOptions<
    InferAttributes<CustodialFacility, { omit: never }>
    > = {
      [Op.or]: {
        name: { [Op.like]: search ? `%${search}%` : '%' },
      },
    };

    const { rows, count } = await this.custodialFacilityModel.findAndCountAll({
      where: where,
      include: this.defaultIncludeable,
      limit: limit,
      offset: offset,
      order: [['name', 'ASC']],
    });

    return { result: rows, totalCount: count };
  }

  public async getDashboardData(): Promise<{
    sumOfCapacity: number;
    totalCount: number;
  }> {
    const sumOfCapacity = await this.custodialFacilityModel.sum('capacity');

    const totalCount = await this.custodialFacilityModel.count();

    return { sumOfCapacity, totalCount };
  }

  public async update(id: number, data: unknown): Promise<CustodialFacility> {
    const { name, capacity, stateId } =
      await custodialFacilityUtil.custodialFacilityUpdateSchema.validateAsync(
        data,
      );

    const custodialFacility = await this.get(id);

    if (stateId) await stateService.getById(stateId);

    let label: string;

    if (name) label = helperUtil.getLabel(name);

    const attributes = { name, capacity, stateId, label };

    await custodialFacility.update(attributes);
    return custodialFacility.reload();
  }

  public async delete(id: number): Promise<CustodialFacility> {
    const custodialFacility = await this.get(id);

    await custodialFacility.destroy();

    return custodialFacility;
  }
}

export default new CustodialFacilityService();
