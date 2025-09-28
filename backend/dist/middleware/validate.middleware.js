"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schemas) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = {};
        if (schemas.body)
            validatedData.body = yield schemas.body.parseAsync(req.body);
<<<<<<< HEAD
        if (schemas.query)
            validatedData.query = yield schemas.query.parseAsync(req.query);
=======
        if (schemas.query) {
            console.log('Validating query:', req.query);
            validatedData.query = yield schemas.query.parseAsync(req.query);
            console.log('Query validation passed');
        }
>>>>>>> 3d1437e (final commit)
        if (schemas.params)
            validatedData.params = yield schemas.params.parseAsync(req.params);
        // Replace request data with validated data
        if (validatedData.body)
            req.body = validatedData.body;
        if (validatedData.query)
            req.query = validatedData.query;
        if (validatedData.params)
            req.params = validatedData.params;
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
<<<<<<< HEAD
=======
            console.error('Validation error:', error.issues);
>>>>>>> 3d1437e (final commit)
            const formattedErrors = error.issues.map((err) => ({
                field: err.path.join('.') || 'body',
                message: err.message,
            }));
            return res.status(400).json({
                status: 'error',
                message: 'Invalid request data. Please check the following fields.',
                errors: formattedErrors,
            });
        }
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});
exports.validate = validate;
