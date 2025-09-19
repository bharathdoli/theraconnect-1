import type { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

interface SchemaParts {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export const validate = (schemas: SchemaParts) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData: any = {};

    if (schemas.body) validatedData.body = await schemas.body.parseAsync(req.body);
    if (schemas.query) validatedData.query = await schemas.query.parseAsync(req.query);
    if (schemas.params) validatedData.params = await schemas.params.parseAsync(req.params);

    // Replace request data with validated data
    if (validatedData.body) req.body = validatedData.body;
    if (validatedData.query) req.query = validatedData.query;
    if (validatedData.params) req.params = validatedData.params;

    return next();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
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
};
