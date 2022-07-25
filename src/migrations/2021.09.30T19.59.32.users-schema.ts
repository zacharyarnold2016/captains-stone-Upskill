import { MigrationFn } from "umzug";
import bcrypt from "bcrypt";
import { DataTypes, Sequelize } from "sequelize";
import { User, UserRole } from "../models/user.model";

const SALT = 10;

export const up: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.createTable("users", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    first_name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      validate: {
        min: 3,
      },
    },
    last_name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
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
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  });
};

export const down: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.dropTable("users");
};

export const initializeAdmin: any = async () => {
  const user = await User.findOne({ where: { id: 1 } });
  const password = await bcrypt.hash("admin", SALT);
  if (!user)
    await User.create({
      id: 1,
      firstName: "admin",
      lastName: "super",
      image: "NoImage",
      title: "Admin",
      summary: "NoSummary",
      role: UserRole.ADMIN,
      email: "admin@admin.com",
      password,
    });
};
