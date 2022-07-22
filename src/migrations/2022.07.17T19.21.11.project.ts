import { DataTypes, Sequelize } from "sequelize";
import { MigrationFn } from "umzug";

export const up: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.createTable("projects", {
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
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(256),
      allowNull: false,
    },

    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  });
};
export const down: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.dropTable("projects");
};
