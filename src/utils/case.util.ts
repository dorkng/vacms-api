import Joi from 'joi';
import { 
  CaseType, CaseStatus, CaseFileType, CaseAdjournmentStatus,
  CaseVerdictType, CaseVerdictStatus,
} from '../interfaces/case.interface';

class CaseUtil {
  public caseCreationSchema = Joi.object().keys({
    suitNumber: Joi.string().required().label('Suit Number'),
    initiatingParties: Joi.string().required().label('Initiating Parties'),
    respondingParties: Joi.string().required().label('Responding Parties'),
    type: Joi.string().required().valid(...Object.values(CaseType)).label('Case Type'),
    status: Joi.string().required().valid(...Object.values(CaseStatus)).default('pending').label('Case Status'),
    courtId: Joi.number().required().label('Court'),
    presidingJudge: Joi.string().optional().label('Presiding Judge'),
    originatingOrganisation: Joi.string().optional().label('Originating Organisation'),
    parentCaseId: Joi.number().optional().label('Parent Case'),
    files: Joi.array().items(
      Joi.object().keys({
        type: Joi.string().required().valid(...Object.values(CaseFileType)).label('File Type'),
        path: Joi.string().required().label('File Path'),
      }),
    ).required().label('Case Documents'),
  });

  public caseAdjournmentCreationSchema = Joi.object().keys({
    caseId: Joi.number().required().label('Case'),
    date: Joi.date().required().label('Adjournment Date'),
    dateAdjournedTo: Joi.date().required().label('Date Adjourned To'),
    status: Joi.string().required().valid(...Object.values(CaseAdjournmentStatus)).label('Adjournment Status'),
    reason: Joi.string().required().label('Adjournment Reason'),
  });

  public caseVerdictCreationSchema = Joi.object().keys({
    caseId: Joi.number().required().label('Case'),
    type: Joi.string().required().valid(...Object.values(CaseVerdictType)).label('Verdict Type'),
    status: Joi.string().required().valid(...Object.values(CaseVerdictStatus)).label('Verdict Status'),
    judge: Joi.string().required().label('Judge'),
  });
  
  public caseNoteCreationSchema = Joi.object().keys({
    caseId: Joi.number().required().label('Case'),
    from: Joi.string().required().label('From'),
    to: Joi.string().required().label('To'),
    content: Joi.string().required().label('Content'),
    date: Joi.date().required().label('Date'),
  });
}

export default new CaseUtil();
