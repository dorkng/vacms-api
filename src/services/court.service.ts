import { Court, CourtType, CourtAddress } from '../db/models';
import { NotFoundError } from '../errors';
import courtUtil from '../utils/court.util';

class CourtService {
  private CourtModel = Court;

  private CourtTypeModel = CourtType;

  private CourtAddressModel = CourtAddress;

  public async create(data: unknown): Promise<Court> {
    const {
      name, typeId, addressId, numberOfCourtRooms, chiefRegistrar,
    } = await courtUtil.courtCreationSchema.validateAsync(data);
    await Promise.all([
      this.getType(typeId),
      this.getAddress(addressId),
    ]);
    const attributes = { 
      name, typeId, addressId, numberOfCourtRooms,
      chiefRegistrar, label: undefined,
    };
    const court = await this.CourtModel.create(attributes);
    return court;
  }

  public async get(id: number): Promise<Court> {
    const court = await this.CourtModel.findByPk(id, {
      include: ['type', 'address'],
    });
    if (!court) throw new NotFoundError('Court not found.');
    return court;
  }

  public async getAll(limit: number, offset: number): Promise<{ result: Court[]; totalCount: number; }> {
    const { rows, count } = await this.CourtModel.findAndCountAll({
      include: ['type', 'address'],
      limit: limit,
      offset: offset,
    });
    return { result: rows, totalCount: count };
  }

  public async update(id: number, data: unknown): Promise<Court> {
    const court = await this.get(id);
    let label: string;
    const {
      name, typeId, addressId, numberOfCourtRooms, chiefRegistrar,
    } = await courtUtil.courtUpdateSchema.validateAsync(data);
    if (typeId) await this.getType(typeId);
    if (addressId) await this.getAddress(addressId);
    if (name) label = name.replace(/\s+/g, '-').toLowerCase();
    const attributes = {
      name, typeId, addressId, numberOfCourtRooms,
      chiefRegistrar, label,
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
    const {
      name, logoUrl,
    } = await courtUtil.courtTypeCreationSchema.validateAsync(data);
    const attributes = { name, logoUrl, label: undefined };
    const courtType = await this.CourtTypeModel.create(attributes);
    return courtType;
  }

  public async getType(id: number): Promise<CourtType> {
    const courtType = await this.CourtTypeModel.findByPk(id);
    if (!courtType) throw new NotFoundError('Court type not found.');
    return courtType;
  }

  public async getAllTypes(limit: number, offset: number): Promise<{ result: CourtType[]; totalCount: number; }> {
    const { rows, count } = await this.CourtTypeModel.findAndCountAll({
      limit: limit,
      offset: offset,
    });
    return { result: rows, totalCount: count };
  }

  public async updateType(id: number, data: unknown): Promise<CourtType> {
    const courtType = await this.getType(id);
    let label: string;
    const { name, logoUrl } = await courtUtil.courtTypeUpdateSchema.validateAsync(data);
    if (name) label = name.replace(/\s+/g, '-').toLowerCase();
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
    const {
      street, city, state,
    } = await courtUtil.courtAddressCreationSchema.validateAsync(data);
    const attributes = { street, city, state };
    const courtAddress = await this.CourtAddressModel.create(attributes);
    return courtAddress;
  }

  public async getAddress(id: number): Promise<CourtAddress> {
    const courtAddress = await this.CourtAddressModel.findByPk(id);
    if (!courtAddress) throw new NotFoundError('Court address not found.');
    return courtAddress;
  }

  public async getAllAddresses(limit: number, offset: number): Promise<{ result: CourtAddress[]; totalCount: number; }> {
    const { rows, count } = await this.CourtAddressModel.findAndCountAll({
      limit: limit,
      offset: offset,
    });
    return { result: rows, totalCount: count };
  }

  public async updateAddress(id: number, data: unknown): Promise<CourtAddress> {
    const courtAddress = await this.getAddress(id);
    const attributes = await courtUtil.courtAddressUpdateSchema.validateAsync(data);
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
