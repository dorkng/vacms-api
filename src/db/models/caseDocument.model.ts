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
import serverConfig from '../../config/server.config';

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
          return `${serverConfig.BASE_URL}/images/${value}`;
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

export default CaseDocument;
