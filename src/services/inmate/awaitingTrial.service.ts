import { WhereOptions, InferAttributes, Op } from 'sequelize';
import {
  AwaitingTrialInmate,
  Court,
  CourtAddress,
  CustodialFacility,
  ProsecutingAgency,
} from '../../db/models';
import { NotFoundError } from '../../errors';
import { CsvFileParseType } from '../../interfaces/csv.interface';
import csvUtil from '../../utils/csv.util';
import inmateUtil from '../../utils/inmate.util';
import courtService from '../court.service';
import custodialFacilityService from '../custodialFacility.service';
import prosecutingAgencyService from '../prosecutingAgency.service';
import { QueryOptions } from '../../interfaces/functions.interface';

class AwaitingTrialInmateService {
  private awaitingTrialInmateModel = AwaitingTrialInmate;

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

  public async create(data: unknown): Promise<AwaitingTrialInmate> {
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
      dateOfArraignment,
      dateOfAdmission,
      otherMeansOfId,
    } = await inmateUtil.awaitingTrialInmateCreationSchema.validateAsync(data);

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
      dateOfArraignment,
      dateOfAdmission,
      otherMeansOfId,
    };

    const awaitingTrialInmate = await this.awaitingTrialInmateModel.create(
      attributes,
    );

    return awaitingTrialInmate.reload({ include: this.defaultIncludeable });
  }

  public async bulkCreate(file: Buffer): Promise<void> {
    const parsedData = await csvUtil.parseCsvFile(
      file,
      CsvFileParseType.AWAITING_TRIAL_INMATE,
    );

    const validatedData =
      await inmateUtil.awaitingTrialInmateBulkCreationSchema.validateAsync(
        parsedData,
      );

    const bulkAttributes = [];

    for (const data of validatedData) {
      const [custodialFacility, court, prosecutingAgency] = await Promise.all([
        custodialFacilityService.getByName(data['Custodial Facility']),
        courtService.getByName(data.Court),
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
          dateOfArraignment: data['Date of Arraignment'],
          dateOfAdmission: data['Date of Admission'],
          otherMeansOfId: data['Other Means of Identification'],
        });
      }
    }

    await this.awaitingTrialInmateModel.bulkCreate(bulkAttributes, {
      ignoreDuplicates: true,
    });
  }

  public async get(id: number): Promise<AwaitingTrialInmate> {
    const awaitingTrialInmate = await this.awaitingTrialInmateModel.findByPk(
      id,
      {
        include: this.defaultIncludeable,
      },
    );

    if (!awaitingTrialInmate) {
      throw new NotFoundError('Inmate not found.');
    }

    return awaitingTrialInmate;
  }

  public async getAll(
    opts: QueryOptions,
  ): Promise<{ result: AwaitingTrialInmate[]; totalCount: number }> {
    const { limit, offset, search } = opts;

    const where: WhereOptions<
    InferAttributes<AwaitingTrialInmate, { omit: never }>
    > = {
      [Op.or]: {
        firstName: { [Op.like]: search ? `%${search}%` : '%' },
        lastName: { [Op.like]: search ? `%${search}%` : '%' },
        otherName: { [Op.like]: search ? `%${search}%` : '%' },
      },
    };

    const { rows, count } = await this.awaitingTrialInmateModel.findAndCountAll(
      {
        where: where,
        include: this.defaultIncludeable,
        limit: limit,
        offset: offset,
        order: [['dateOfArraignment', 'DESC']],
      },
    );

    return { result: rows, totalCount: count };
  }

  public async update(id: number, data: unknown): Promise<AwaitingTrialInmate> {
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
      dateOfArraignment,
      dateOfAdmission,
      otherMeansOfId,
    } = await inmateUtil.awaitingTrialInmateUpdateSchema.validateAsync(data);

    const awaitingTrialInmate = await this.get(id);

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
      dateOfArraignment,
      dateOfAdmission,
      otherMeansOfId,
    };

    await awaitingTrialInmate.update(attributes);
    return awaitingTrialInmate.reload();
  }

  public async delete(id: number): Promise<AwaitingTrialInmate> {
    const awaitingTrialInmate = await this.get(id);

    await awaitingTrialInmate.destroy();

    return awaitingTrialInmate;
  }
}

export default new AwaitingTrialInmateService();
