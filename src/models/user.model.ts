import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Models } from "../interfaces/general";
import { Experience } from "./experience.model";
import Feedback from "./feedback.model";
import Project from "./project.model";

export enum UserRole {
  Admin = "Admin",
  User = "User",
}

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  title: string;
  summary: string;
  role: UserRole;
  email: string;
  password: string;
}

export class User
  extends Model<UserAttributes, Optional<UserAttributes, "id">>
  implements UserAttributes
{
  id: number;

  firstName: string;

  lastName: string;

  image: string;

  title: string;

  summary: string;

  role: UserRole;

  email: string;

  password: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  static defineSchema(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        firstName: {
          field: "first_name",
          type: new DataTypes.STRING(128),
          allowNull: false,
          validate: {
            min: 3,
          },
        },
        lastName: {
          field: "last_name",
          type: new DataTypes.STRING(128),
          allowNull: true,
          validate: {
            min: 3,
          },
        },
        image: {
          type: new DataTypes.STRING(256),
          allowNull: false,
          unique: true,
        },
        title: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
        summary: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
        role: {
          type: new DataTypes.STRING(50),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
            min: 8,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            min: 8,
          },
        },
      },
      {
        tableName: "users",
        underscored: true,
        sequelize,
      }
    );
  }

  static associate(models: Models, sequelize: Sequelize) {
    User.hasMany(Experience, { foreignKey: "user_id" });
    User.hasMany(Feedback, { foreignKey: "to_user" });
    User.hasMany(Project, { foreignKey: "user_id" });
  }
}
