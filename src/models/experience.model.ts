import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "../interfaces/general";
import { User } from "./user.model";

export interface ExperienceAttributes {
  id: number;
  user_id: number;
  company_name: string;
  role: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

export class Experience
  extends Model<ExperienceAttributes, Optional<ExperienceAttributes, "id">>
  implements ExperienceAttributes
{
  id: number;

  user_id: number;

  company_name: string;

  role: string;

  startDate: Date;

  endDate: Date;

  description: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  static defineSchema(sequelize: Sequelize) {
    Experience.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        company_name: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        role: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        description: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
      },
      {
        tableName: "experiences",
        underscored: true,
        sequelize,
      }
    );
  }

  static associate(models: Models, sequelize: Sequelize) {
    Experience.belongsTo(User, {
      foreignKey: "user_id",
    });
  }
}
