import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "../interfaces/general";

interface ProjectAttributes {
  id: number;
  user_id: number;
  image: string;
  description: string;
}

export class Project
  extends Model<ProjectAttributes>
  implements ProjectAttributes
{
  id: number;

  user_id: number;

  image: string;

  description: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  static defineSchema(sequelize: Sequelize) {
    Project.init(
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
        image: {
          type: new DataTypes.STRING(),
          allowNull: false,
        },
        description: {
          type: new DataTypes.STRING(256),
        },
      },
      {
        tableName: "projects",
        underscored: true,
        sequelize,
      }
    );
  }

  static associate(models: Models, sequelize: Sequelize) {
    Project.belongsTo(models.user, {
      foreignKey: "user_id",
    });
  }
}
