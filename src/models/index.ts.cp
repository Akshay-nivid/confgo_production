/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sequelize } from 'sequelize';
import path from 'path';
import { Logger } from '../utils/logger';
import { initModels } from './init-models'; // Import init-models function

const config = require(path.resolve(__dirname, '../config/config'));

// Determine the environment (development, production, etc.)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config];

// Initialize Sequelize
export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

// Interface for the Database object to hold models and Sequelize instance
export interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  [key: string]: typeof Sequelize | any;
}

// Initialize the DB object
const db: DB = {
  sequelize,
  Sequelize,
};

// Call initModels function to initialize models
const models = initModels(sequelize);

// Assign models to the db object
(Object.keys(models) as (keyof typeof models)[]).forEach((modelName) => {
  db[modelName] = models[modelName];
});

// Automatically call associate method on each model if it exists
Object.keys(db).forEach((modelName) => {
  if (db[modelName]?.associate) {
    db[modelName].associate(db);
  }
});

// Sync all models with the database
sequelize
  .sync({ alter: false }) // Sync models without altering the schema
  .then(() => {
    Logger.log('Database & tables created successfully!');
  })
  .catch((error) => {
    Logger.error('Error syncing database:', error);
  });

export default db;
