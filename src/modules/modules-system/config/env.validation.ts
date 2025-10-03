import * as Joi from 'joi';

export const envValidation = Joi.object({
  // Application
  PORT: Joi.number().required(),

  // DB configuration
  DATABASE_URL: Joi.string().required(),

  DOMAIN_BE: Joi.string().required(),

  ACCESS_TOKEN_SECRET: Joi.string().optional(),
  ACCESS_TOKEN_EXPIRES: Joi.string().optional(),
  REFRESH_TOKEN_SECRET: Joi.string().optional(),
  REFRESH_TOKEN_EXPIRES: Joi.string().optional(),
  WEBSOCKET_SECRET: Joi.string().optional(),
});
