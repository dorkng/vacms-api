import { Court, CourtType, CourtAddress, State } from '../db/models';
import { NotFoundError } from '../errors';
import courtUtil from '../utils/court.util';
import helperUtil from '../utils/helper.util';
import stateService from './state.service';

class CourtService {
  private CourtModel = Court;

  private CourtTypeModel = CourtType;

  private CourtAddressModel = CourtAddress;

  private courtAddressIncludeable = [{ model: State, as: 'state' }];

  private courtIncludeable = [
    { model: CourtType, as: 'type' },
    {
      model: CourtAddress,
      as: 'address',
      include: this.courtAddressIncludeable,
    },
  ];

  public async create(data: unknown): Promise<Court> {
    const { name, typeId, addressId, numberOfCourtRooms, chiefRegistrar } =
      await courtUtil.courtCreationSchema.validateAsync(data);

    await Promise.all([this.getType(typeId), this.getAddress(addressId)]);

    const attributes = {
      name,
      typeId,
      addressId,
      numberOfCourtRooms,
      chiefRegistrar,
      label: undefined,
    };

    const court = await this.CourtModel.create(attributes);
    return court.reload({ include: this.courtIncludeable });
  }

  public async get(id: number): Promise<Court> {
    const court = await this.CourtModel.findByPk(id, {
      include: this.courtIncludeable,
    });

    if (!court) throw new NotFoundError('Court not found.');

    return court;
  }

  public async getAll(
    limit: number,
    offset: number,
  ): Promise<{ result: Court[]; totalCount: number }> {
    const { rows, count } = await this.CourtModel.findAndCountAll({
      include: this.courtIncludeable,
      limit: limit,
      offset: offset,
    });

    return { result: rows, totalCount: count };
  }

  public async update(id: number, data: unknown): Promise<Court> {
    const court = await this.get(id);

    let label: string;
    const { name, typeId, addressId, numberOfCourtRooms, chiefRegistrar } =
      await courtUtil.courtUpdateSchema.validateAsync(data);

    if (typeId) await this.getType(typeId);

    if (addressId) await this.getAddress(addressId);

    if (name) label = helperUtil.getLabel(name);

    const attributes = {
      name,
      typeId,
      addressId,
      numberOfCourtRooms,
      chiefRegistrar,
      label,
    };

    await court.update(attributes);
    return court.reload();
  }

  public async delete(id: number): Promise<Court> {
    const court = await this.get(id);

    await court.destroy();

    return court;
  }

  public async createType(data: unknown): Promise<CourtType> {
    const { name, logoUrl } =
      await courtUtil.courtTypeCreationSchema.validateAsync(data);

    const attributes = { name, logoUrl, label: undefined };

    const courtType = await this.CourtTypeModel.create(attributes);
    return courtType;
  }

  public async getType(id: number): Promise<CourtType> {
    const courtType = await this.CourtTypeModel.findByPk(id);

    if (!courtType) throw new NotFoundError('Court type not found.');

    return courtType;
  }

  public async getAllTypes(
    limit: number,
    offset: number,
  ): Promise<{ result: CourtType[]; totalCount: number }> {
    const { rows, count } = await this.CourtTypeModel.findAndCountAll({
      limit: limit,
      offset: offset,
    });

    return { result: rows, totalCount: count };
  }

  public async updateType(id: number, data: unknown): Promise<CourtType> {
    const courtType = await this.getType(id);

    let label: string;
    const { name, logoUrl } =
      await courtUtil.courtTypeUpdateSchema.validateAsync(data);

    if (name) label = helperUtil.getLabel(name);

    const attributes = { name, logoUrl, label };

    await courtType.update(attributes);
    return courtType.reload();
  }

  public async deleteType(id: number): Promise<CourtType> {
    const courtType = await this.getType(id);

    await courtType.destroy();
    return courtType;
  }

  public async createAddress(data: unknown): Promise<CourtAddress> {
    const { street, city, stateId } =
      await courtUtil.courtAddressCreationSchema.validateAsync(data);

    await stateService.getById(stateId);

    const attributes = { street, city, stateId };

    const courtAddress = await this.CourtAddressModel.create(attributes);
    return courtAddress.reload({ include: this.courtAddressIncludeable });
  }

  public async getAddress(id: number): Promise<CourtAddress> {
    const courtAddress = await this.CourtAddressModel.findByPk(id, {
      include: this.courtAddressIncludeable,
    });

    if (!courtAddress) throw new NotFoundError('Court address not found.');

    return courtAddress;
  }

  public async getAllAddresses(
    limit: number,
    offset: number,
  ): Promise<{ result: CourtAddress[]; totalCount: number }> {
    const { rows, count } = await this.CourtAddressModel.findAndCountAll({
      include: this.courtAddressIncludeable,
      limit: limit,
      offset: offset,
    });

    return { result: rows, totalCount: count };
  }

  public async updateAddress(id: number, data: unknown): Promise<CourtAddress> {
    const courtAddress = await this.getAddress(id);

    const attributes = await courtUtil.courtAddressUpdateSchema.validateAsync(
      data,
    );

    await courtAddress.update(attributes);
    return courtAddress.reload();
  }

  public async deleteAddress(id: number): Promise<CourtAddress> {
    const courtAddress = await this.getAddress(id);
    await courtAddress.destroy();
    return courtAddress;
  }
}

export default new CourtService();
