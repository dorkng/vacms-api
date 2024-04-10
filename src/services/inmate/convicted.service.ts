import { WhereOptions, InferAttributes, Op } from 'sequelize';
import {
  ConvictedInmate,
  Court,
  CourtAddress,
  CustodialFacility,
  ProsecutingAgency,
} from '../../db/models';
import { ConflictError, NotFoundError } from '../../errors';
import { CsvFileParseType } from '../../interfaces/csv.interface';
import csvUtil from '../../utils/csv.util';
import inmateUtil from '../../utils/inmate.util';
import courtService from '../court.service';
import custodialFacilityService from '../custodialFacility.service';
import prosecutingAgencyService from '../prosecutingAgency.service';
import { QueryOptions } from '../../interfaces/functions.interface';

class ConvictedInmateService {
  private convictedInmateModel = ConvictedInmate;

  private defaultIncludeable = [
    { model: CustodialFacility, as: 'custodialFacility', include: ['state'] },
    {
      model: Court,
      as: 'court',
      include: [{ model: CourtAddress, as: 'address', include: ['state'] }],
    },
    {
      model: ProsecutingAgency,
      as: 'prosecutingAgency',
      include: ['state'],
    },
  ];

  public async create(data: unknown): Promise<ConvictedInmate> {
    const {
      firstName,
      lastName,
      otherName,
      image,
      sex,
      custodyNumber,
      custodialFacilityId,
      caseNumber,
      courtId,
      offense,
      offenseInterpretation,
      prosecutingAgencyId,
      edr,
      ldr,
      compensation,
      sentence,
      optionOfFine,
      dateOfConviction,
    } = await inmateUtil.convictedInmateCreationSchema.validateAsync(data);

    await Promise.all([
      custodialFacilityService.get(custodialFacilityId),
      courtService.get(courtId),
      prosecutingAgencyService.get(prosecutingAgencyId),
    ]);

    const attributes = {
      firstName,
      lastName,
      otherName,
      image,
      sex,
      custodyNumber,
      custodialFacilityId,
      caseNumber,
      courtId,
      offense,
      offenseInterpretation,
      prosecutingAgencyId,
      edr,
      ldr,
      compensation,
      sentence,
      optionOfFine,
      dateOfConviction,
    };

    const convictedInmate = await this.convictedInmateModel.create(attributes);

    return convictedInmate.reload({ include: this.defaultIncludeable });
  }

  public async bulkCreate(file: Buffer): Promise<void> {
    const parsedData = await csvUtil.parseCsvFile(
      file,
      CsvFileParseType.CONVICTED_INMATE,
    );

    const validatedData =
      await inmateUtil.convictedInmateBulkCreationSchema.validateAsync(
        parsedData,
      );

    const bulkAttributes = [];

    for (const data of validatedData) {
      const [custodialFacility, court, prosecutingAgency] = await Promise.all([
        custodialFacilityService.getByName(data['Custodial Facility']),
        courtService.getByNameTypeAndState(
          data.Court,
          data['Court Type'],
          data['Court State'],
        ),
        prosecutingAgencyService.getByName(data['Prosecuting Agency']),
      ]);

      if (custodialFacility && court && prosecutingAgency) {
        bulkAttributes.push({
          firstName: data['First Name'],
          lastName: data['Last Name'],
          otherName: data['Other Name'],
          image: data.Image,
          sex: data.Sex,
          custodyNumber: data['Custody Number'],
          custodialFacilityId: custodialFacility.id,
          caseNumber: data['Case Number'],
          courtId: court.id,
          offense: data.Offense,
          offenseInterpretation: data['Offense Interpretation'],
          prosecutingAgencyId: prosecutingAgency.id,
          edr: data.EDR,
          ldr: data.LDR,
          compensation: data.Compensation,
          sentence: data.Sentence,
          optionOfFine: data['Option of Fine'],
          dateOfConviction: data['Date of Conviction'],
        });
      }
    }

    if (bulkAttributes.length === 0) {
      throw new ConflictError('No inmates added.');
    }

    await this.convictedInmateModel.bulkCreate(bulkAttributes, {
      ignoreDuplicates: true,
    });
  }

  public async get(id: number): Promise<ConvictedInmate> {
    const convictedInmate = await this.convictedInmateModel.findByPk(id, {
      include: this.defaultIncludeable,
    });

    if (!convictedInmate) {
      throw new NotFoundError('Inmate not found.');
    }

    return convictedInmate;
  }

  public async getAll(
    opts: QueryOptions,
  ): Promise<{ result: ConvictedInmate[]; totalCount: number }> {
    const { limit, offset, search } = opts;

    const where: WhereOptions<
    InferAttributes<ConvictedInmate, { omit: never }>
    > = {
      [Op.or]: {
        firstName: { [Op.like]: search ? `%${search}%` : '%' },
        lastName: { [Op.like]: search ? `%${search}%` : '%' },
        otherName: { [Op.like]: search ? `%${search}%` : '%' },
      },
    };

    const { rows, count } = await this.convictedInmateModel.findAndCountAll({
      where: where,
      include: this.defaultIncludeable,
      limit: limit,
      offset: offset,
      order: [['dateOfConviction', 'DESC']],
    });

    return { result: rows, totalCount: count };
  }

  public async getTotalCount() {
    return this.convictedInmateModel.count();
  }

  public async update(id: number, data: unknown): Promise<ConvictedInmate> {
    const {
      firstName,
      lastName,
      otherName,
      image,
      sex,
      custodyNumber,
      custodialFacilityId,
      caseNumber,
      courtId,
      offense,
      offenseInterpretation,
      prosecutingAgencyId,
      edr,
      ldr,
      compensation,
      sentence,
      optionOfFine,
      dateOfConviction,
    } = await inmateUtil.convictedInmateUpdateSchema.validateAsync(data);

    const convictedInmate = await this.get(id);

    if (custodialFacilityId) {
      await custodialFacilityService.get(custodialFacilityId);
    }

    if (courtId) await courtService.get(courtId);

    if (prosecutingAgencyId) {
      await prosecutingAgencyService.get(prosecutingAgencyId);
    }

    const attributes = {
      firstName,
      lastName,
      otherName,
      image,
      sex,
      custodyNumber,
      custodialFacilityId,
      caseNumber,
      courtId,
      offense,
      offenseInterpretation,
      prosecutingAgencyId,
      edr,
      ldr,
      compensation,
      sentence,
      optionOfFine,
      dateOfConviction,
    };

    await convictedInmate.update(attributes);
    return convictedInmate.reload();
  }

  public async delete(id: number): Promise<ConvictedInmate> {
    const convictedInmate = await this.get(id);

    await convictedInmate.destroy();

    return convictedInmate;
  }
}

export default new ConvictedInmateService();
