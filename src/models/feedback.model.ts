import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "../interfaces/general";
import { User } from "./user.model";

interface FeedbackAttributes {
  id: number;
  from_user: number;
  to_user: number;
  content: string;
  company_name: string;
}

export class Feedback
  extends Model<FeedbackAttributes>
  implements FeedbackAttributes
{
  id: number;

  from_user: number;

  to_user: number;

  content: string;

  company_name: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  static defineSchema(sequelize: Sequelize) {
    Feedback.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        from_user: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        to_user: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(256),
          allowNull: false,
        },
        company_name: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
      },
      {
        tableName: "feedbacks",
        underscored: true,
        sequelize,
      }
    );
  }

  static associate(models: Models, sequelize: Sequelize) {
    Feedback.belongsTo(models.user, {
      foreignKey: "user_id",
    });
  }
}
