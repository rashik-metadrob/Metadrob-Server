import dotenv from 'dotenv';
import path from 'path';
import { validationResult, check } from 'express-validator';
import {envValidation} from './envValidationInterface'
// Load environment variables from the .env file
const envFile = path.join(process.cwd(), '.env');
dotenv.config({ path: envFile });

console.log('env file', envFile);

// Define the validation rules for the environment variables
const envVarsValidation = [
  check('NODE_ENV').isIn(['production', 'development', 'test']).withMessage('Invalid NODE_ENV'),
  check('PORT').isNumeric().withMessage('PORT must be a number').default(3000),
  check('MONGODB_URL').isString().withMessage('MONGODB_URL is required').notEmpty(),
  check('DEFAULT_PASSWORD').isString().withMessage('DEFAULT_PASSWORD is required').notEmpty(),
  check('FACEBOOK_API_KEY').isString().withMessage('FACEBOOK_API_KEY is required').notEmpty(),
  check('FACEBOOK_API_SECRET').isString().withMessage('FACEBOOK_API_SECRET is required').notEmpty(),
  check('FACEBOOK_CALLBACK_URL').isString().withMessage('FACEBOOK_CALLBACK_URL is required').notEmpty(),
  check('JWT_SECRET').isString().withMessage('JWT_SECRET is required').notEmpty(),
  check('JWT_ACCESS_EXPIRATION_MINUTES').isNumeric().withMessage('JWT_ACCESS_EXPIRATION_MINUTES must be a number').default(30),
  check('JWT_REFRESH_EXPIRATION_DAYS').isNumeric().withMessage('JWT_REFRESH_EXPIRATION_DAYS must be a number').default(30),
  check('JWT_RESET_PASSWORD_EXPIRATION_MINUTES').isNumeric().withMessage('JWT_RESET_PASSWORD_EXPIRATION_MINUTES must be a number').default(10),
  check('JWT_VERIFY_EMAIL_EXPIRATION_MINUTES').isNumeric().withMessage('JWT_VERIFY_EMAIL_EXPIRATION_MINUTES must be a number').default(10),
  check('SMTP_HOST').optional().isString().withMessage('SMTP_HOST should be a string'),
  check('SMTP_PORT').optional().isNumeric().withMessage('SMTP_PORT should be a number'),
  check('SMTP_USERNAME').optional().isString().withMessage('SMTP_USERNAME should be a string'),
  check('SMTP_PASSWORD').optional().isString().withMessage('SMTP_PASSWORD should be a string'),
  check('EMAIL_FROM').optional().isString().withMessage('EMAIL_FROM should be a string'),
  check('EASY_SHIP_API_KEY').optional().isString().withMessage('EASY_SHIP_API_KEY should be a string'),
  check('CLIENT_URL').optional().isString().withMessage('CLIENT_URL should be a string'),
  check('PAYPAL_CLIENT_ID').optional().isString().withMessage('PAYPAL_CLIENT_ID should be a string'),
  check('PAYPAL_SECRET').optional().isString().withMessage('PAYPAL_SECRET should be a string'),
  check('SPOTIFY_CLIENT_ID').optional().isString().withMessage('SPOTIFY_CLIENT_ID should be a string'),
  check('SPOTIFY_CLIENT_SECRET').optional().isString().withMessage('SPOTIFY_CLIENT_SECRET should be a string'),
  check('SPOTIFY_REDIRECT').optional().isString().withMessage('SPOTIFY_REDIRECT should be a string'),
  check('SHOULD_COMPRESS_GLB').optional().isString().withMessage('SHOULD_COMPRESS_GLB should be a string'),
  check('SHOULD_COMPRESS_IMAGE').optional().isString().withMessage('SHOULD_COMPRESS_IMAGE should be a string'),
  check('SERVER_URL').optional().isString().withMessage('SERVER_URL should be a string'),
  check('DATABASE_NAME').optional().isString().withMessage('DATABASE_NAME should be a string'),
  check('UPLOAD_DIRECTORY').optional().isString().withMessage('UPLOAD_DIRECTORY should be a string'),
  check('QUEUE_NAME').optional().isString().withMessage('QUEUE_NAME should be a string'),
  check('INVITATION_EXPIRATION_MINUTES').isNumeric().withMessage('INVITATION_EXPIRATION_MINUTES must be a number').default(10800),
  check('ZOHO_DESK_CLIENT_ID').optional().isString().withMessage('ZOHO_DESK_CLIENT_ID should be a string'),
  check('ZOHO_DESK_CLIENT_SECRET').optional().isString().withMessage('ZOHO_DESK_CLIENT_SECRET should be a string'),
  check('ZOHO_DESK_DEPARTMENT_ID').optional().isString().withMessage('ZOHO_DESK_DEPARTMENT_ID should be a string'),
  check('ZOHO_DESK_GRANT_CODE').optional().isString().withMessage('ZOHO_DESK_GRANT_CODE should be a string'),
];

// Validate the environment variables
const validateEnvVars = () => {
  // Create a validation function
  const validationFunctions = envVarsValidation.map((validation) => validation.run({}));
  
  // Execute all validation functions
  Promise.all(validationFunctions).then(() => {
    const results:any = validationResult({ ...process.env });
    
    if (!results.isEmpty()) {
      throw new Error(`Config validation error: ${results.errors.map((err) => err.msg).join(', ')}`);
    }
  }).catch((error) => {
    throw new Error(`Config validation error: ${error.message}`);
  });
};

validateEnvVars();

export const config:envValidation = {
  env: process.env.NODE_ENV!,
  port: parseInt(process.env.PORT!, 10),
  serverUrl: process.env.SERVER_URL!,
  mongoose: {
    url: process.env.MONGODB_URL! + (process.env.NODE_ENV === 'test' ? '-test' : ''),
    databaseName: process.env.DATABASE_NAME!,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES!, 10),
    refreshExpirationDays: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS!, 10),
    resetPasswordExpirationMinutes: parseInt(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES!, 10),
    verifyEmailExpirationMinutes: parseInt(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES!, 10),
  },
  defaultPassword: process.env.DEFAULT_PASSWORD!,
  facebook: {
    clientID: process.env.FACEBOOK_API_KEY!,
    clientSecret: process.env.FACEBOOK_API_SECRET!,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT!, 10),
      auth: {
        user: process.env.SMTP_USERNAME!,
        pass: process.env.SMTP_PASSWORD!,
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
    from: process.env.EMAIL_FROM!,
  },
  easyShipApiKey: process.env.EASY_SHIP_API_KEY!,
  clientUrl: process.env.CLIENT_URL!,
  paypalClientId: process.env.PAYPAL_CLIENT_ID!,
  paypalSecret: process.env.PAYPAL_SECRET!,
  spotify: {
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID!,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    spotifyRedirect: process.env.SPOTIFY_REDIRECT!,
  },
  shouldCompressGlb: process.env.SHOULD_COMPRESS_GLB!,
  shouldCompressImage: process.env.SHOULD_COMPRESS_IMAGE!,
  uploadDirectory: process.env.UPLOAD_DIRECTORY!,
  queueName: process.env.QUEUE_NAME!,
  invitationExpirationMinutes: parseInt(process.env.INVITATION_EXPIRATION_MINUTES!, 10),
  zohoDeskClientId: process.env.ZOHO_DESK_CLIENT_ID!,
  zohoDeskClientSecret: process.env.ZOHO_DESK_CLIENT_SECRET!,
  zohoDeskDepartmentId: process.env.ZOHO_DESK_DEPARTMENT_ID!,
  zohoDeskGrantCode: process.env.ZOHO_DESK_GRANT_CODE!,
};
