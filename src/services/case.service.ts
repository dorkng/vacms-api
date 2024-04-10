/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  Op,
  WhereOptions,
  InferAttributes,
  fn,
  col,
  ModelStatic,
} from 'sequelize';
import {
  Case,
  CaseAdjournment,
  CaseVerdict,
  CaseNote,
  CaseReport,
  CaseDocument,
  Court,
  AwaitingTrialInmate,
  ConvictedInmate,
  CourtAddress,
  ProsecutingAgency,
} from '../db/models';
import { ConflictError, NotFoundError } from '../errors';
import caseUtil from '../utils/case.util';
import helperUtil from '../utils/helper.util';
import courtService from './court.service';
import fileService from './file.service';
import userService from './user.service';
import { AccessLevel } from '../interfaces/user.interface';
import { CaseStatus, CaseType } from '../interfaces/case.interface';
import { QueryOptions } from '../interfaces/functions.interface';

class CaseService {
  private CaseModel = Case;

  private CaseAdjournmentModel = CaseAdjournment;

  private CaseVerdictModel = CaseVerdict;

  private CaseReportModel = CaseReport;

  private CaseNoteModel = CaseNote;

  private CaseDocumentModel = CaseDocument;

  public async create(data: unknown): Promise<Case> {
    const attributes = await caseUtil.caseCreationSchema.validateAsync(data);

    const { suitNumber, courtId, parentCaseId } = attributes;

    await Promise.all([
      this.checkSuitNumber(suitNumber),
      courtService.get(courtId),
    ]);

    if (parentCaseId) await this.get(parentCaseId);

    const newCase = await this.CaseModel.create(attributes, {
      include: [
        {
          model: CaseDocument,
          as: 'documents',
        },
      ],
    });

    return newCase;
  }

  public async handleForInmates(
    model: ModelStatic<AwaitingTrialInmate | ConvictedInmate>,
    data: AwaitingTrialInmate[] | ConvictedInmate[],
  ): Promise<void> {
    const casesAttributes = [];

    const inmatesToUpdate: { id: number; caseNumber: string }[] = [];

    for (const inmate of data) {
      await inmate.reload({
        include: [
          {
            model: Court,
            as: 'court',
            include: [
              { model: CourtAddress, as: 'address', include: ['state'] },
            ],
          },
          {
            model: ProsecutingAgency,
            as: 'prosecutingAgency',
          },
        ],
      });

      let suitNumber = inmate.caseNumber;

      if (inmate.caseNumber) {
        const caseExists = await this.getBySuitNumber(inmate.caseNumber);

        if (!caseExists) {
          casesAttributes.push({
            suitNumber,
            initiatingParties: inmate.prosecutingAgency.name,
            respondingParties: `${inmate.firstName} ${inmate.lastName}`,
            type: CaseType.criminal,
            courtId: inmate.courtId,
          });
        }
      } else {
        suitNumber = await this.getCaseNumber(inmate);

        casesAttributes.push({
          suitNumber,
          initiatingParties: inmate.prosecutingAgency.name,
          respondingParties: `${inmate.firstName} ${inmate.lastName}`,
          type: CaseType.criminal,
          courtId: inmate.courtId,
        });
      }

      inmatesToUpdate.push({
        id: inmate.id,
        caseNumber: suitNumber,
      });
    }

    await this.CaseModel.bulkCreate(casesAttributes, {
      ignoreDuplicates: true,
    });

    for (const inmate of inmatesToUpdate) {
      const { caseNumber, id } = inmate;

      await model.update({ caseNumber }, { where: { id } });
    }
  }

  public async update(id: number, data: unknown): Promise<Case> {
    const retrievedCase = await this.getById(id);
    const attributes = await caseUtil.caseUpdateSchema.validateAsync(data);
    const { suitNumber, courtId, parentCaseId } = attributes;
    if (retrievedCase.suitNumber !== suitNumber) {
      await this.checkSuitNumber(suitNumber);
    }
    await courtService.get(courtId);
    if (parentCaseId) await this.get(parentCaseId);
    await retrievedCase.update(attributes);
    return retrievedCase.reload();
  }

  public async getBySuitNumber(suitNumber: string): Promise<Case> {
    const caseExists = await this.CaseModel.findOne({
      where: { suitNumber },
      include: [
        {
          model: Court,
          as: 'court',
          include: ['type', 'address'],
        },
        'documents',
        'adjournments',
        'reports',
        {
          model: Case,
          as: 'interlocutories',
          include: [
            {
              model: Court,
              as: 'court',
              include: ['type', 'address'],
            },
            'verdict',
          ],
        },
        'verdict',
        {
          model: CaseNote,
          as: 'notes',
          include: ['to', 'from'],
        },
      ],
    });

    return caseExists;
  }

  private async checkSuitNumber(suitNumber: string): Promise<Case> {
    const caseExists = await this.CaseModel.findOne({
      where: { suitNumber },
    });

    if (caseExists) throw new ConflictError('Suit number already exists.');

    return caseExists;
  }

  public async get(id: number): Promise<Case> {
    const retrievedCase = await this.CaseModel.findByPk(id, {
      include: [
        {
          model: Court,
          as: 'court',
          include: ['type', 'address'],
        },
        'documents',
        'adjournments',
        'reports',
        {
          model: Case,
          as: 'interlocutories',
          include: [
            {
              model: Court,
              as: 'court',
              include: ['type', 'address'],
            },
            'verdict',
          ],
        },
        'verdict',
        {
          model: CaseNote,
          as: 'notes',
          include: ['to', 'from'],
        },
      ],
    });

    if (!retrievedCase) throw new NotFoundError('Case not found.');

    return retrievedCase;
  }

  public async getAll(
    opts: QueryOptions,
  ): Promise<{ result: Case[]; totalCount: number }> {
    const { limit, offset, status, type, search } = opts;

    const where: WhereOptions<InferAttributes<Case, { omit: never }>> = {
      [Op.or]: {
        suitNumber: { [Op.like]: search ? `%${search}%` : '%' },
        initiatingParties: { [Op.like]: search ? `%${search}%` : '%' },
        respondingParties: { [Op.like]: search ? `%${search}%` : '%' },
        presidingJudge: { [Op.like]: search ? `%${search}%` : '%' },
        originatingOrganisation: { [Op.like]: search ? `%${search}%` : '%' },
      },
    };

    status ? (where['status'] = status) : where;
    type ? (where['type'] = type) : where;

    const { rows, count } = await this.CaseModel.findAndCountAll({
      where: where,
      include: [
        {
          model: Court,
          as: 'court',
          include: ['type', 'address'],
        },
      ],
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    return { result: rows, totalCount: count };
  }

  private async getById(id: number): Promise<Case> {
    const caseExists = await this.CaseModel.findByPk(id);

    if (!caseExists) throw new NotFoundError('Case not found.');

    return caseExists;
  }

  public async createAdjournment(data: unknown): Promise<CaseAdjournment> {
    const attributes =
      await caseUtil.caseAdjournmentCreationSchema.validateAsync(data);

    const { caseId } = attributes;

    await this.getById(caseId);

    const caseAdjournment = await this.CaseAdjournmentModel.create(attributes);
    return caseAdjournment;
  }

  public async createVerdict(data: unknown): Promise<CaseVerdict> {
    const attributes = await caseUtil.caseVerdictCreationSchema.validateAsync(
      data,
    );

    const { caseId } = attributes;

    await this.getById(caseId);

    const caseVerdict = await this.CaseVerdictModel.create(attributes);

    await this.updateCaseStatus(caseId, CaseStatus['verdict/judgement-passed']);
    return caseVerdict;
  }

  private async updateCaseStatus(
    id: number,
    status: CaseStatus,
  ): Promise<void> {
    await this.CaseModel.update({ status }, { where: { id } });
  }

  public async createNote(userId: number, data: unknown): Promise<CaseNote> {
    const { caseId, toId, content } =
      await caseUtil.caseNoteCreationSchema.validateAsync(data);

    const attributes = { caseId, fromId: userId, toId, content };

    await Promise.all([this.getById(caseId), userService.getById(toId)]);

    const caseNote = await this.CaseNoteModel.create(attributes);
    return caseNote;
  }

  public async getNote(id: number): Promise<CaseNote> {
    const caseNote = await this.CaseNoteModel.findByPk(id, {
      include: ['case', 'to', 'from'],
    });

    if (!caseNote) throw new NotFoundError('Case not not found.');

    return caseNote;
  }

  public async createReport(data: unknown): Promise<CaseReport> {
    const attributes = await caseUtil.caseReportCreationSchema.validateAsync(
      data,
    );

    const { caseId } = attributes;

    await this.getById(caseId);

    const caseReport = await this.CaseReportModel.create(attributes);
    return caseReport;
  }

  public async createDocument(data: unknown): Promise<CaseDocument> {
    const attributes = await caseUtil.caseDocumentCreationSchema.validateAsync(
      data,
    );

    const { caseId } = attributes;

    await this.getById(caseId);

    const caseDocument = await this.CaseDocumentModel.create(attributes);
    return caseDocument;
  }

  public async deleteDocument(id: number): Promise<CaseDocument> {
    const caseDocument = await this.CaseDocumentModel.findByPk(id);

    if (!caseDocument) throw new NotFoundError('Case document not found.');

    await caseDocument.destroy();
    fileService.delete(caseDocument.path);
    return caseDocument;
  }

  public async getDashboardStatistics(
    isAdmin: boolean,
    accessLevel: AccessLevel,
  ): Promise<any[]> {
    const statistics = [];
    if (
      ['registrar', 'lawyer', 'director', 'permanent-secretary'].includes(
        accessLevel,
      ) ||
      isAdmin
    ) {
      const allCase = await this.getAllCaseStats();
      const activeCase = await this.getActiveCaseStats();
      const caseDistributionByDepartment =
        await this.getCaseDistributionByDepartmentStats();
      statistics.push({ allCase, activeCase, caseDistributionByDepartment });
    }

    if (['attorney-general'].includes(accessLevel) || isAdmin) {
      const civilCase = await this.getCaseStatsByType(CaseType.civil);
      const appealCase = await this.getCaseStatsByType(CaseType.appeal);
      const criminalCase = await this.getCaseStatsByType(CaseType.criminal);
      statistics.push({ civilCase, appealCase, criminalCase });
    }

    return statistics[0];
  }

  private async getAllCaseStats() {
    const count = await this.CaseModel.count();

    const { currentDate, lastMonthDate } = helperUtil.getStartAndEndOfMonth();

    const lastMonthCount = await this.CaseModel.count({
      where: {
        createdAt: {
          [Op.gte]: lastMonthDate,
          [Op.lte]: currentDate,
        },
      },
    });

    const difference = count - lastMonthCount;
    return { count, difference };
  }

  private async getActiveCaseStats() {
    const count = await this.CaseModel.count({
      where: { status: { [Op.ne]: CaseStatus['verdict/judgement-passed'] } },
    });

    const { currentDate, lastMonthDate } = helperUtil.getStartAndEndOfMonth();

    const lastMonthCount = await this.CaseModel.count({
      where: {
        status: { [Op.ne]: CaseStatus['verdict/judgement-passed'] },
        createdAt: {
          [Op.gte]: lastMonthDate,
          [Op.lte]: currentDate,
        },
      },
    });

    const percentage = (count / lastMonthCount) * 100;
    return { count, percentage };
  }

  private async getCaseDistributionByDepartmentStats() {
    const caseDistribution = await this.CaseModel.findAll({
      attributes: ['type', [fn('COUNT', col('*')), 'count']],
      group: 'type',
      order: [[fn('COUNT', col('*')), 'desc']],
    });
    return caseDistribution;
  }

  private async getCaseStatsByType(type: CaseType) {
    const count = await this.CaseModel.count({
      where: { type },
    });

    const { currentDate, lastMonthDate } = helperUtil.getStartAndEndOfMonth();

    const lastMonthCount = await this.CaseModel.count({
      where: {
        type,
        createdAt: {
          [Op.gte]: lastMonthDate,
          [Op.lte]: currentDate,
        },
      },
    });

    const difference = count - lastMonthCount;
    return { count, difference };
  }

  private async getCaseNumber(
    inmate: AwaitingTrialInmate | ConvictedInmate,
  ): Promise<string> {
    while (true) {
      let suitNumber = this.generateRandomSuitNumber(inmate.court);

      const count = await this.CaseModel.count({
        where: { suitNumber },
      });

      if (count === 0) {
        return suitNumber;
      }
    }
  }

  private generateRandomSuitNumber(court: Court): string {
    // Extract the first two letters of the state name
    const stateAbbreviation = court.address.state.name
      .slice(0, 2)
      .toUpperCase();

    // Extract the first two letters of the court name
    const courtAbbreviation = court.name.slice(0, 2).toUpperCase();

    // Generate six random digits
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();

    // Format the suit number
    const suitNumber = `${stateAbbreviation}/${courtAbbreviation}/${randomDigits}`;

    return suitNumber;
  }
}

export default new CaseService();
