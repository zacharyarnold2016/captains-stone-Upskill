import { DataTypes, Sequelize } from "sequelize";
import { MigrationFn } from "umzug";

export const up: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.createTable("feedbacks", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  });
};
export const down: MigrationFn<Sequelize> = async ({ context }) => {
  const q = context.getQueryInterface();

  await q.dropTable("feedbacks");
};
