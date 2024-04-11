import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import {
  IAwaitingTrialInmateAttribute,
  InmateSexType,
} from '../../interfaces/inmate.interface';
import { Court, CustodialFacility, ProsecutingAgency } from './index';
import helperUtil from '../../utils/helper.util';

class AwaitingTrialInmate
  extends Model<
  InferAttributes<AwaitingTrialInmate>,
  InferCreationAttributes<AwaitingTrialInmate>
  >
  implements IAwaitingTrialInmateAttribute {
  declare id: CreationOptional<number>;

  declare firstName: string;

  declare lastName: string;

  declare otherName?: string;

  declare image?: string;

  declare sex: InmateSexType;

  declare custodyNumber?: string;

  declare custodialFacilityId: number;

  declare caseNumber?: string;

  declare courtId: number;

  declare offense?: string;

  declare offenseInterpretation?: string;

  declare prosecutingAgencyId: number;

  declare dateOfArraignment?: Date;

  declare dateOfAdmission?: Date;

  declare otherMeansOfId?: string;

  public readonly court?: Court;

  public readonly prosecutingAgency?: ProsecutingAgency;
}

export function init(connection: Sequelize) {
  AwaitingTrialInmate.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otherName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const value = this.getDataValue('image');

          return helperUtil.getFileUrl(value);
        },
      },
      sex: {
        type: DataTypes.ENUM(...Object.values(InmateSexType)),
        allowNull: false,
      },
      custodyNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      custodialFacilityId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      caseNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      courtId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      offense: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
      },
      offenseInterpretation: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
      },
      prosecutingAgencyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      dateOfArraignment: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dateOfAdmission: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      otherMeansOfId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'awaiting_trial_inmates',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export function associate() {
  AwaitingTrialInmate.belongsTo(CustodialFacility, {
    foreignKey: {
      allowNull: false,
      name: 'custodialFacilityId',
      field: 'custodialFacilityId',
    },
    onDelete: 'CASCADE',
    as: 'custodialFacility',
  });

  AwaitingTrialInmate.belongsTo(Court, {
    foreignKey: {
      allowNull: false,
      name: 'courtId',
      field: 'courtId',
    },
    onDelete: 'CASCADE',
    as: 'court',
  });

  AwaitingTrialInmate.belongsTo(ProsecutingAgency, {
    foreignKey: {
      allowNull: false,
      name: 'prosecutingAgencyId',
      field: 'prosecutingAgencyId',
    },
    onDelete: 'CASCADE',
    as: 'prosecutingAgency',
  });
}

export default AwaitingTrialInmate;
