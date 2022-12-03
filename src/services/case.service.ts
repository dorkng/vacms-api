/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Op, WhereOptions, InferAttributes } from 'sequelize';
import { Case, CaseAdjournment, CaseVerdict, CaseNote, CaseReport, CaseFile, Court } from '../db/models';
import { ConflictError, NotFoundError } from '../errors';
import caseUtil from '../utils/case.util';
import courtService from './court.service';
import { QueryOptions } from '../interfaces/functions.interface';

class CaseService {
  private CaseModel = Case;

  private CaseAdjournmentModel = CaseAdjournment;

  private CaseVerdictModel = CaseVerdict;
  
  private CaseReportModel = CaseReport;

  private CaseNoteModel = CaseNote;

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
          model: CaseFile,
          as: 'files',
        },
      ],
    });
    return newCase;
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
        'files',
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
        'notes',
      ],
    });
    if (!retrievedCase) throw new NotFoundError('Case not found.');
    return retrievedCase;
  }

  public async getAll(opts: QueryOptions): Promise<{ result: Case[]; totalCount: number; }> {
    const { limit, offset, status, type, search } = opts;
    const where: WhereOptions<InferAttributes<Case, { omit: never; }>> = {
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
    const attributes = await caseUtil.caseAdjournmentCreationSchema.validateAsync(data);
    const { caseId } = attributes;
    await this.getById(caseId);
    const caseAdjournment = await this.CaseAdjournmentModel.create(attributes);
    return caseAdjournment;
  }

  public async createVerdict(data: unknown): Promise<CaseVerdict> {
    const attributes = await caseUtil.caseVerdictCreationSchema.validateAsync(data);
    const { caseId } = attributes;
    await this.getById(caseId);
    const caseVerdict = await this.CaseVerdictModel.create(attributes);
    return caseVerdict;
  }

  public async createNote(data: unknown): Promise<CaseNote> {
    const attributes = await caseUtil.caseNoteCreationSchema.validateAsync(data);
    const { caseId } = attributes;
    await this.getById(caseId);
    const caseNote = await this.CaseNoteModel.create(attributes);
    return caseNote;
  }

  public async createReport(data: unknown): Promise<CaseReport> {
    const attributes = await caseUtil.caseReportCreationSchema.validateAsync(data);
    const { caseId } = attributes;
    await this.getById(caseId);
    const caseReport = await this.CaseReportModel.create(attributes);
    return caseReport;
  }
}

export default new CaseService();
