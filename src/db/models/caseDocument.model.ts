import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import {
  ICaseDocumentAttribute,
  CaseDocumentType,
} from '../../interfaces/case.interface';
import { Case } from './index';
import helperUtil from '../../utils/helper.util';

class CaseDocument
  extends Model<
  InferAttributes<CaseDocument>,
  InferCreationAttributes<CaseDocument>
  >
  implements ICaseDocumentAttribute {
  declare id: CreationOptional<number>;

  declare caseId: number;

  declare type: CaseDocumentType;

  declare path: string;
}

export function init(connection: Sequelize) {
  CaseDocument.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      caseId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(CaseDocumentType)),
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          const value = this.getDataValue('path');

          return helperUtil.getFileUrl(value);
        },
      },
    },
    {
      tableName: 'case_documents',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export function associate() {
  CaseDocument.belongsTo(Case, {
    foreignKey: {
      allowNull: false,
      name: 'caseId',
      field: 'caseId',
    },
    onDelete: 'CASCADE',
    as: 'case',
  });
}

export default CaseDocument;
