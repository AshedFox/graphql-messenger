import {NextFunction, Request, Response} from "express";
import {body, param, validationResult} from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }

    next();
}

const getUser = [
    param('id').exists({checkNull: true}).withMessage('id must exists')
        .isMongoId().withMessage('id must be correct mongodb id'),
    validate
]

const updateUser = [
    param('id').exists({checkNull: true}).isMongoId(),
    body('email').exists({checkNull: true}).withMessage('email must exists')
        .normalizeEmail().isEmail().withMessage('email must be correct'),
    body('name').optional({checkFalsy: true})
        .isString().withMessage('name must be string')
        .trim().isLength({min: 1, max: 200}).withMessage('name must have length between 1 and 200'),
    validate
]

const deleteUser = [
    param('id').exists({checkNull: true}).withMessage('id must exists')
        .isMongoId().withMessage('id must be correct mongodb id'),
    validate
]

const usersValidation = {
    getUser,
    updateUser,
    deleteUser
}

export default usersValidation;
