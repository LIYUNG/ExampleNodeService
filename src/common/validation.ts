import { body, param, validationResult } from 'express-validator';

const fieldsValidation =
  (...rules: any[]) =>
  async (req: any) => {
    await Promise.all(rules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) errors.throw();
  };

const makeOptional = (rule: any) => rule.optional();

// common rules
const checkUserFirstname = body('firstname')
  .isString()
  .notEmpty()
  .withMessage('First name cannot be empty');

const checkUserLastname = body('lastname')
  .isString()
  .notEmpty()
  .withMessage('Last name cannot be empty');

const checkEmail = body('email', 'Invalid email address')
  .normalizeEmail({ gmail_remove_dots: false })
  .isEmail();

const checkPassword = body('password')
  .isString()
  .isLength({ min: 8 })
  .withMessage('Password must contain at least 8 characters');

const checkToken = body('token').isString().notEmpty();

// const checkObjectID = param('id', 'Invalid id').custom(ObjectID.isValid);

const validationCallBack = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Middleware to validate ObjectId
const validateCourseId = [
  param('courseId')
    .isMongoId()
    .withMessage('Invalid course ID format. It must be a valid ObjectId.'),
  validationCallBack,
];

const validateStudentId = [
  param('studentId')
    .isMongoId()
    .withMessage('Invalid student ID format. It must be a valid ObjectId.'),
  validationCallBack,
];

export {
  fieldsValidation,
  makeOptional,
  checkUserFirstname,
  checkUserLastname,
  checkEmail,
  checkPassword,
  checkToken,
  validateCourseId,
  validateStudentId,
};
