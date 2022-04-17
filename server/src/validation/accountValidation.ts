import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }

    next();
}

const signUp = [
    body('email').exists({checkNull: true}).withMessage('email must exists')
        .normalizeEmail().isEmail().withMessage('email must be correct'),
    body('password').exists({checkNull: true}).withMessage('password must exists')
        .isHash("sha512").withMessage('password must be sha512 hash'),
    body('name').optional({checkFalsy: true})
        .isString().withMessage('name must be string')
        .trim().isLength({min: 1, max: 200}).withMessage('name must have length between 1 and 200'),
    validate
]

const login = [
    body('email').exists({checkNull: true}).withMessage('email must exists')
        .normalizeEmail().isEmail().withMessage('email must be correct'),
    body('password').exists({checkNull: true}).withMessage('password must exists')
        .isHash("sha512").withMessage('password must be sha512 hash'),
    validate
]

const accountValidation = {
    signUp,
    login
}

export default accountValidation;
