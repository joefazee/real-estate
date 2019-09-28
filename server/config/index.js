require('dotenv').config();
const { Joi } = require('celebrate');

const envVarsSchema = Joi.object({
  PORT: Joi.number().default(5000),
  HOST: Joi.string().default('localhost'),
  NODE_ENV: Joi.string().allow(['development', 'production', 'staging', 'testing']).default('development'),
  DB_DATABASE: Joi.string().required().description('Database name'),
  DB_USERNAME: Joi.string().required().description('Database Username'),
  DB_PASSWORD: Joi.string().required().description('Database Password'),
  DB_HOST: Joi.string().default('127.0.0.1'),
  DB_PORT: Joi.string().default('3306'),
  JWT_SECRET: Joi.string().required().description('JWT required to sign token'),
  DB_DIALECT: Joi.string().allow(['mysql', 'sqlite', 'postgres']).default('mysql'),
  MAIL_USERNAME: Joi.string().required().description('Username required for sign in to service'),
  MAIL_PASSWORD: Joi.string().required().description('Password required for sign in to service'),
  MAIL_HOST: Joi.string().required().description('Mail host required to send mails'),
  MAIL_PORT: Joi.number().required().description('Mail port required to send mails'),
  EMAIL_SERVICE_FROM: Joi.string().required().default('noreply@diaspora-invest.com'),
  CLOUDINARY_CLOUD_NAME: Joi.string().required().description('Cloud storage name'),
  CLOUDINARY_API_KEY: Joi.string().required().description('Access keyId to storage cloud'),
  CLOUDINARY_API_SECRET: Joi.string().required().description('File storage space secret accesskey to upload file'),
  USER_DEFAULT_AVATAR: Joi.string().required().description('URL to default profile avatar'),
  SECURE_COOKIE_NAME: Joi.string().required(),
  BCRYPT_ROUND: Joi.number().required().description('bcrypt password hash')
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  host: envVars.HOST,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  secureCookieName: envVars.SECURE_COOKIE_NAME,
  defaultAvatar: envVars.USER_DEFAULT_AVATAR,
  bcryptSalt: envVars.BCRYPT_ROUND,
  database: {
    dbDialect: envVars.DB_DIALECT,
    dbHost: envVars.DB_HOST,
    dbPort: envVars.DB_PORT,
    dbName: envVars.DB_DATABASE,
    dbUsername: envVars.DB_USERNAME,
    dbPassword: envVars.DB_PASSWORD
  },
  mail: {
    sender: envVars.EMAIL_SERVICE_FROM,
    host: envVars.MAIL_HOST,
    port: envVars.MAIL_PORT,
    auth: {
      user: envVars.MAIL_USERNAME,
      pass: envVars.MAIL_PASSWORD
    }
  },
  spaceCredentials: {
    secretAccessKey: envVars.CLOUDINARY_API_SECRET,
    accesskeyId: envVars.CLOUDINARY_API_KEY,
    cloudName: envVars.CLOUDINARY_CLOUD_NAME
  }
};

  module.exports = config;
