import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validateSchema = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      res.status(422).json({ error: message });
    }
  };
};
