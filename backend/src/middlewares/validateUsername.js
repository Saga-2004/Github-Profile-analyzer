const { body, validationResult } = require('express-validator');

/**
 * Validation rules and custom formatter for the GitHub username parameter.
 * Enforces GitHub's official username rules:
 * - 1 to 39 characters
 * - Only alphanumeric characters and single hyphens
 * - Cannot start or end with a hyphen
 * - Cannot contain consecutive hyphens
 */
const validateUsername = [
  body('username')
    .trim()
    .isLength({ min: 1, max: 39 })
    .withMessage('Username must be between 1 and 39 characters')
    .matches(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)
    .withMessage('Username must start and end with an alphanumeric character, and can contain single, non-consecutive hyphens'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }
    next();
  }
];

module.exports = validateUsername;
