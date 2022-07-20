import { MigrationFn } from "umzug";
import { DataTypes, Sequelize } from "sequelize";

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
