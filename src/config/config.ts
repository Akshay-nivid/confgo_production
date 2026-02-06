import { Dialect } from 'sequelize/types';

interface IDatabaseConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: Dialect;
}

interface IConfig {
  development: IDatabaseConfig;
  qa: IDatabaseConfig;
  test: IDatabaseConfig;
  production: IDatabaseConfig;
}

// Configuration object without environment variables
export const config: IConfig = {
  development: {
    username: 'root',
    password: 'f4J6(B^l@NtQ*9p,', // Use your actual password if needed
    database: 'event_management',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  qa: {
    username: 'root',
    password: 'f4J6(B^l@NtQ*9p,', // Use your actual password if needed
    database: 'event_management',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: 'f4J6(B^l@NtQ*9p,', // Use your actual password if needed
    database: 'event_management',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: 'f4J6(B^l@NtQ*9p,', // Use your actual password if needed
    database: 'event_management',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};

module.exports = config; // Use module.exports instead of export default
