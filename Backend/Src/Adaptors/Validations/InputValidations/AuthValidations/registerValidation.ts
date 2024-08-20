import {body} from 'express-validator'

const registerValidation = [
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .notEmpty()
      .withMessage('Email is required'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
      
    
    body('name')
      .notEmpty()
      .withMessage('Name is required'),
    
    body('role')
      .optional()
      .isString()
      .withMessage('Role must be a string'),
    
    body('appSource')
      .optional()
      .isNumeric()
      .withMessage('App Source must be a number'),
  ];

  export default registerValidation