import Joi from 'joi';
import { InmateSexType } from '../interfaces/inmate.interface';

class InmateUtil {
  private allowedData = ['', null];

  public awaitingTrialInmateCreationSchema = Joi.object().keys({
    firstName: Joi.string().required().label('First Name'),
    lastName: Joi.string().required().label('Last Name'),
    otherName: Joi.string()
      .allow(...this.allowedData)
      .label('Other Name'),
    image: Joi.string()
      .allow(...this.allowedData)
      .label('Image'),
    sex: Joi.string()
      .valid(...Object.values(InmateSexType))
      .required()
      .label('Sex'),
    custodyNumber: Joi.string()
      .allow(...this.allowedData)
      .label('Custody Number'),
    custodialFacilityId: Joi.number().required().label('Custodial Facility'),
    caseNumber: Joi.string()
      .allow(...this.allowedData)
      .label('Case Number'),
    courtId: Joi.number().required().label('Court'),
    offense: Joi.string()
      .allow(...this.allowedData)
      .label('Offense'),
    offenseInterpretation: Joi.string()
      .allow(...this.allowedData)
      .label('Offense Interpretation'),
    prosecutingAgencyId: Joi.number().required().label('Prosecuting Agency'),
    dateOfArraignment: Joi.date()
      .allow(...this.allowedData)
      .label('Date of Arraignment'),
    dateOfAdmission: Joi.date()
      .allow(...this.allowedData)
      .label('Date of Admission'),
    otherMeansOfId: Joi.string()
      .allow(...this.allowedData)
      .label('Other Means of Identification'),
  });

  public convictedInmateCreationSchema = Joi.object().keys({
    firstName: Joi.string().required().label('First Name'),
    lastName: Joi.string().required().label('Last Name'),
    otherName: Joi.string()
      .allow(...this.allowedData)
      .label('Other Name'),
    image: Joi.string()
      .allow(...this.allowedData)
      .label('Image'),
    sex: Joi.string()
      .valid(...Object.values(InmateSexType))
      .required()
      .label('Sex'),
    custodyNumber: Joi.string()
      .allow(...this.allowedData)
      .label('Custody Number'),
    custodialFacilityId: Joi.number().required().label('Custodial Facility'),
    caseNumber: Joi.string()
      .allow(...this.allowedData)
      .label('Case Number'),
    courtId: Joi.number().required().label('Court'),
    offense: Joi.string()
      .allow(...this.allowedData)
      .label('Offense'),
    offenseInterpretation: Joi.string()
      .allow(...this.allowedData)
      .label('Offense Interpretation'),
    prosecutingAgencyId: Joi.number().required().label('Prosecuting Agency'),
    edr: Joi.date()
      .allow(...this.allowedData)
      .label('EDR'),
    ldr: Joi.date()
      .allow(...this.allowedData)
      .label('LDR'),
    compensation: Joi.string()
      .allow(...this.allowedData)
      .label('Compensation'),
    sentence: Joi.string()
      .allow(...this.allowedData)
      .label('Sentence'),
    optionOfFine: Joi.string()
      .allow(...this.allowedData)
      .label('Option of Fine'),
    dateOfConviction: Joi.date()
      .allow(...this.allowedData)
      .label('Date of Conviction'),
  });

  public awaitingTrialInmateBulkCreationSchema = Joi.array().items(
    Joi.object().keys({
      'First Name': Joi.string().required().label('First Name'),
      'Last Name': Joi.string().required().label('Last Name'),
      'Other Name': Joi.string()
        .allow(...this.allowedData)
        .label('Other Name'),
      Image: Joi.string()
        .allow(...this.allowedData)
        .label('Image'),
      Sex: Joi.string()
        .uppercase()
        .valid(...Object.values(InmateSexType))
        .required()
        .label('Sex'),
      'Custody Number': Joi.string()
        .allow(...this.allowedData)
        .label('Custody Number'),
      'Custodial Facility': Joi.string().required().label('Custodial Facility'),
      'Case Number': Joi.string()
        .allow(...this.allowedData)
        .label('Case Number'),
      Court: Joi.string().required().label('Court'),
      'Court Type': Joi.string().required().label('Court Type'),
      'Court State': Joi.string().required().label('Court State'),
      Offense: Joi.string()
        .allow(...this.allowedData)
        .label('Offense'),
      'Offense Interpretation': Joi.string()
        .allow(...this.allowedData)
        .label('Offense Interpretation'),
      'Prosecuting Agency': Joi.string()
        .allow(...this.allowedData)
        .required()
        .label('Prosecuting Agency'),
      'Date of Arraignment': Joi.date()
        .allow(...this.allowedData)
        .label('Date of Arraignment'),
      'Date of Admission': Joi.date()
        .allow(...this.allowedData)
        .label('Date of Admission'),
      'Other Means of Identification': Joi.string()
        .allow(...this.allowedData)
        .label('Other Means of Identification'),
    }),
  );

  public convictedInmateBulkCreationSchema = Joi.array().items(
    Joi.object().keys({
      'First Name': Joi.string().required().label('First Name'),
      'Last Name': Joi.string().required().label('Last Name'),
      'Other Name': Joi.string()
        .allow(...this.allowedData)
        .label('Other Name'),
      Image: Joi.string()
        .allow(...this.allowedData)
        .label('Image'),
      Sex: Joi.string()
        .uppercase()
        .valid(...Object.values(InmateSexType))
        .required()
        .label('Sex'),
      'Custody Number': Joi.string()
        .allow(...this.allowedData)
        .label('Custody Number'),
      'Custodial Facility': Joi.string().required().label('Custodial Facility'),
      'Case Number': Joi.string()
        .allow(...this.allowedData)
        .label('Case Number'),
      Court: Joi.string().required().label('Court'),
      'Court Type': Joi.string().required().label('Court Type'),
      'Court State': Joi.string().required().label('Court State'),
      Offense: Joi.string()
        .allow(...this.allowedData)
        .label('Offense'),
      'Offense Interpretation': Joi.string()
        .allow(...this.allowedData)
        .label('Offense Interpretation'),
      'Prosecuting Agency': Joi.string().required().label('Prosecuting Agency'),
      EDR: Joi.date()
        .allow(...this.allowedData)
        .label('EDR'),
      LDR: Joi.date()
        .allow(...this.allowedData)
        .label('LDR'),
      Compensation: Joi.string()
        .allow(...this.allowedData)
        .label('Compensation'),
      Sentence: Joi.string()
        .allow(...this.allowedData)
        .label('Sentence'),
      'Option of Fine': Joi.string()
        .allow(...this.allowedData)
        .label('Option of Fine'),
      'Date of Conviction': Joi.date()
        .allow(...this.allowedData)
        .label('Date of Conviction'),
    }),
  );

  public awaitingTrialInmateUpdateSchema = Joi.object().keys({
    firstName: Joi.string()
      .allow(...this.allowedData)
      .label('First Name'),
    lastName: Joi.string()
      .allow(...this.allowedData)
      .label('Last Name'),
    otherName: Joi.string()
      .allow(...this.allowedData)
      .label('Other Name'),
    image: Joi.string()
      .allow(...this.allowedData)
      .label('Image'),
    sex: Joi.string()
      .valid(...Object.values(InmateSexType))
      .allow(...this.allowedData)
      .label('Sex'),
    custodyNumber: Joi.string()
      .allow(...this.allowedData)
      .label('Custody Number'),
    custodialFacilityId: Joi.number()
      .allow(...this.allowedData)
      .label('Custodial Facility'),
    caseNumber: Joi.string()
      .allow(...this.allowedData)
      .label('Case Number'),
    courtId: Joi.number()
      .allow(...this.allowedData)
      .label('Court'),
    offense: Joi.string()
      .allow(...this.allowedData)
      .label('Offense'),
    offenseInterpretation: Joi.string()
      .allow(...this.allowedData)
      .label('Offense Interpretation'),
    prosecutingAgencyId: Joi.number()
      .allow(...this.allowedData)
      .label('Prosecuting Agency'),
    dateOfArraignment: Joi.date()
      .allow(...this.allowedData)
      .label('Date of Arraignment'),
    dateOfAdmission: Joi.date()
      .allow(...this.allowedData)
      .label('Date of Admission'),
    otherMeansOfId: Joi.string()
      .allow(...this.allowedData)
      .label('Other Means of Identification'),
  });

  public convictedInmateUpdateSchema = Joi.object().keys({
    firstName: Joi.string()
      .allow(...this.allowedData)
      .label('First Name'),
    lastName: Joi.string()
      .allow(...this.allowedData)
      .label('Last Name'),
    otherName: Joi.string()
      .allow(...this.allowedData)
      .label('Other Name'),
    image: Joi.string()
      .allow(...this.allowedData)
      .label('Image'),
    sex: Joi.string()
      .valid(...Object.values(InmateSexType))
      .allow(...this.allowedData)
      .label('Sex'),
    custodyNumber: Joi.string()
      .allow(...this.allowedData)
      .label('Custody Number'),
    custodialFacilityId: Joi.number()
      .allow(...this.allowedData)
      .label('Custodial Facility'),
    caseNumber: Joi.string()
      .allow(...this.allowedData)
      .label('Case Number'),
    courtId: Joi.number()
      .allow(...this.allowedData)
      .label('Court'),
    offense: Joi.string()
      .allow(...this.allowedData)
      .label('Offense'),
    offenseInterpretation: Joi.string()
      .allow(...this.allowedData)
      .label('Offense Interpretation'),
    prosecutingAgencyId: Joi.number()
      .allow(...this.allowedData)
      .label('Prosecuting Agency'),
    edr: Joi.date()
      .allow(...this.allowedData)
      .label('EDR'),
    ldr: Joi.date()
      .allow(...this.allowedData)
      .label('LDR'),
    compensation: Joi.string()
      .allow(...this.allowedData)
      .label('Compensation'),
    sentence: Joi.string()
      .allow(...this.allowedData)
      .label('Sentence'),
    optionOfFine: Joi.string()
      .allow(...this.allowedData)
      .label('Option of Fine'),
    dateOfConviction: Joi.date()
      .allow(...this.allowedData)
      .label('Date of Conviction'),
  });
}

export default new InmateUtil();
