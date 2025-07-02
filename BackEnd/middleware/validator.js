const { body, validationResult } = require('express-validator');

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid id ' + id);
        err.status = 400;
        return next(err);
    }
    next();
}

exports.validateSignUp = [body('firstName','First Name cannot be empty').notEmpty().trim().escape(),
    body('lastName','Last Name cannot be empty').notEmpty().trim().escape(),
    body('email','Email must not be Empty').bail().isEmail().withMessage('Email must be a valid Email Address').trim().escape().normalizeEmail(),
    body('password','Password must not be Empty').notEmpty().bail().isLength({min: 8, max:64}).withMessage('Password length must be between 8 and 64 characters').trim().escape()];

exports.validateLogin = [body('email','Email must not be Empty').bail().isEmail().withMessage('Email must be a valid Email Address').trim().escape().normalizeEmail(),
    body('password','Password must not be Empty').notEmpty().bail().isLength({min: 8, max:64}).withMessage('Password length must be between 8 and 64 characters').trim().escape()];

exports.validateRsvp = [body('rsvp','Rsvp must not be Empty').notEmpty().bail().isIn(['Yes', 'No']).withMessage('Rsvp Must be in Yes or No').trim().escape()];

exports.validateEvent = [body('event','Event Name must not be Empty').notEmpty().bail().trim().escape(),
    body('place','place cannot be empty').notEmpty().trim().escape(),
    body('description','Description must not be Empty').notEmpty().bail().isLength({min: 10}).withMessage('Description must be atleast 10 characters').trim().escape(),
    body('startDate','Event Start Date Must not be Empty').notEmpty().bail().isISO8601()
    .withMessage('Event Start Date must be Valid & should be in YYYY-MM-DDThh:mm:ssTZD').bail()
    .trim().escape().custom((value) => {
        const now = new Date();
        const start = new Date(value);
        if (start <= now) {
            throw new Error('Event Start Date must be after today');
        }
        return true;
    }),
    body('endDate','End Date must not be empty').notEmpty().bail().isISO8601()
    .withMessage('End Date must be Valid & should be in YYYY-MM-DDThh:mm:ssTZD').bail()
    .trim().escape().custom((value, {req}) => {
        const start = new Date(req.body.startDate);
        const end = new Date(value);
        if (end <= start) {
            throw new Error('End Date must be after Start Date');
        }
        return true;
    })];

exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req).array();
    if (req.validationErrors) {
        errors = errors.concat(req.validationErrors);
    }
        if(errors.length >0 ){
            return res.status(400).json({
                status: 'fail',
                errors: errors.map(error => error.msg)
            });
        }
        else {
            return next();
        }
};

exports.convertDateTimetoISO = (req, res, next) => {
    console.log(req.body);
    if (req.body.startDate && !req.body.startDate.includes('Z')) {
        req.body.startDate = req.body.startDate + ':00Z';
    }
    if (req.body.endDate && !req.body.endDate.includes('Z')) {
        req.body.endDate = req.body.endDate + ':00Z';
    }
    next();
};

exports.checkImage = (req, res, next) => {
    if (!req.file) {
        req.validationErrors = req.validationErrors || [];
        req.validationErrors.push({ msg: 'Image cannot be Empty', param: 'image' });
    }
    next();
};