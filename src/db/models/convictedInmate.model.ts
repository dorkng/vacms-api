import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import {
  IConvictedInmateAttribute,
  InmateSexType,
} from '../../interfaces/inmate.interface';
import { Court, CustodialFacility, ProsecutingAgency } from './index';
import helperUtil from '../../utils/helper.util';

class ConvictedInmate
  extends Model<
  InferAttributes<ConvictedInmate>,
  InferCreationAttributes<ConvictedInmate>
  >
  implements IConvictedInmateAttribute {
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

  declare edr?: Date;

  declare ldr?: Date;

  declare compensation?: string;

  declare sentence?: string;

  declare optionOfFine?: string;

  declare dateOfConviction?: Date;

  public readonly court?: Court;

  public readonly prosecutingAgency?: ProsecutingAgency;
}

export function init(connection: Sequelize) {
  ConvictedInmate.init(
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
      edr: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ldr: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      compensation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sentence: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      optionOfFine: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateOfConviction: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'convicted_inmates',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export function associate() {
  ConvictedInmate.belongsTo(CustodialFacility, {
    foreignKey: {
      allowNull: false,
      name: 'custodialFacilityId',
      field: 'custodialFacilityId',
    },
    onDelete: 'CASCADE',
    as: 'custodialFacility',
  });

  ConvictedInmate.belongsTo(Court, {
    foreignKey: {
      allowNull: false,
      name: 'courtId',
      field: 'courtId',
    },
    onDelete: 'CASCADE',
    as: 'court',
  });

  ConvictedInmate.belongsTo(ProsecutingAgency, {
    foreignKey: {
      allowNull: false,
      name: 'prosecutingAgencyId',
      field: 'prosecutingAgencyId',
    },
    onDelete: 'CASCADE',
    as: 'prosecutingAgency',
  });
}

export default ConvictedInmate;
