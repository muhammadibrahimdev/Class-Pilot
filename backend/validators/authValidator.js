import { body } from 'express-validator'

export const registerValidator = [
    body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min:3 }).withMessage("Name must be atleast 3 characters"),

    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email"),

    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be atleast 6 characters"),

    body("role")
    .optional()
    .isIn(["schooladmin", "teacher", "parent", "student"])
    .withMessage("Invalid role"),
];

export const loginValidator = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email"),

    body("password")
    .notEmpty().withMessage("Password is required"),
]