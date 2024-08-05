import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const environment = process.env.NODE_ENV || 'development';
export const mongodb = {
  uri:
    process.env.MONGO_URL
    || 'mongodb://localhost:27017/lightweight-cron',
};
export const redis = {
  host:
    process.env.REDIS_HOSTNAME
    || 'localhost',
  port:
    process.env.REDIS_PORT
    || '6379',
  mode: process.env.REDIS_MODE
    || 'SINGLE',
};

export const mysql = {
  username: process.env.SQL_DB_USER_NAME || 'root',
  password: process.env.SQL_DB_USER_PASSWORD || 'secretpass',
  database: process.env.SQL_DB_NAME || 'localhost',
  host: process.env.SQL_DB_HOST || '127.0.0.1',
  port: process.env.SQL_DB_PORT || '3306',
  dialect: process.env.SQL_DB_DIALECT || 'mysql',
  logging: process.env.NODE_ENV == 'development',
};

const config = {
  environment,
  mongodb,
  redis,
  mysql,
};

export default config;
