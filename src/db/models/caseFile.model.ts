import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { ICaseFileAttribute, CaseFileType } from '../../interfaces/case.interface';

class CaseFile
  extends Model<InferAttributes<CaseFile>, InferCreationAttributes<CaseFile>>
  implements ICaseFileAttribute {
  declare id: CreationOptional<number>;

  declare caseId: number;

  declare type: CaseFileType;

  declare path: string;
}

export function init(connection: Sequelize) {
  CaseFile.init(
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
        type: DataTypes.ENUM(...Object.values(CaseFileType)),
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'case_files',
      timestamps: true,
      sequelize: connection,
    },
  );
}

export default CaseFile;