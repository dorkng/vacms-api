import Joi from 'joi';
import { 
  CaseType, CaseStatus, CaseDocumentType,
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
    remarks: Joi.string().optional().label('Remarks'),
    documents: Joi.array().items(
      Joi.object().keys({
        type: Joi.string().required().valid(...Object.values(CaseDocumentType)).label('Document Type'),
        path: Joi.string().required().label('File Path'),
      }),
    ).required().label('Case Documents'),
  });

  public caseUpdateSchema = Joi.object().keys({
    suitNumber: Joi.string().required().label('Suit Number'),
    initiatingParties: Joi.string().required().label('Initiating Parties'),
    respondingParties: Joi.string().required().label('Responding Parties'),
    type: Joi.string().required().valid(...Object.values(CaseType)).label('Case Type'),
    status: Joi.string().required().valid(...Object.values(CaseStatus)).default('pending').label('Case Status'),
    courtId: Joi.number().required().label('Court'),
    presidingJudge: Joi.string().optional().label('Presiding Judge'),
    originatingOrganisation: Joi.string().optional().label('Originating Organisation'),
    parentCaseId: Joi.number().optional().label('Parent Case'),
    remarks: Joi.string().optional().label('Remarks'),
  });

  public caseAdjournmentCreationSchema = Joi.object().keys({
    caseId: Joi.number().required().label('Case'),
    dateAdjournedTo: Joi.date().required().label('Date Adjourned To'),
    reason: Joi.string().required().label('Adjournment Reason'),
  });

  public caseVerdictCreationSchema = Joi.object().keys({
    caseId: Joi.number().required().label('Case'),
    path: Joi.string().required().label('Verdict'),
  });

  public caseReportCreationSchema = Joi.object().keys({
    caseId: Joi.number().required().label('Case'),
    content: Joi.string().required().label('Content'),
  });
  
  public caseNoteCreationSchema = Joi.object().keys({
    caseId: Joi.number().required().label('Case'),
    toId: Joi.number().required().label('To'),
    content: Joi.string().required().label('Content'),
  });

  public caseDocumentCreationSchema = Joi.object().keys({
    caseId: Joi.number().required().label('Case'),
    type: Joi.string().required().valid(...Object.values(CaseDocumentType)).label('Case Document Type'),
    path: Joi.string().required().label('File Path'),
  });
}

export default new CaseUtil();
