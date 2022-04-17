import {body, param, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }

    next();
}

const getChat = [
    param('id').exists({checkNull: true}).withMessage('id must exists')
        .isMongoId().withMessage('id must be correct mongodb id'),
    validate
];

const createChat = [
    body('name')
        .exists({checkNull: true}).withMessage('name must exists')
        .isString().withMessage('name must be string')
        .trim().isLength({min: 1, max: 200}).withMessage('name must have length between 1 and 200'),
    validate
]

const updateChat = [
    param('id').exists({checkNull: true}).withMessage('id must exists')
        .isMongoId().withMessage('id must be correct mongodb id'),
    body('id').exists({checkNull: true}).withMessage('id must exists')
        .isMongoId().withMessage('id must be correct mongodb id'),
    body('name')
        .exists({checkNull: true}).withMessage('name must exists')
        .isString().withMessage('name must be string')
        .trim().isLength({min: 1, max: 200}).withMessage('name must have length between 1 and 200'),
    body('createdAt').optional({checkFalsy: true})
        .isISO8601().withMessage('createdAt must be correct ISO8601 date')
        .toDate(),
    validate
]

const deleteChat = [
    param('id').exists({checkNull: true}).withMessage('id must exists')
        .isMongoId().withMessage('id must be correct mongodb id'),
    validate
]

const chatsValidation = {
    getChat,
    createChat,
    updateChat,
    deleteChat
};

export default chatsValidation;
