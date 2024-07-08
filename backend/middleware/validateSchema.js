// middleware/validateSchema.js

import jsonschema from "jsonschema";
import { BadRequestError } from "./expressError.js";

const validateSchema = (schema) => {
  return (req, res, next) => {
    const result = jsonschema.validate(req.body, schema);
    if (!result.valid) {
      const errors = result.errors.map((error) => error.stack);
      return next(new BadRequestError(errors));
    }
    next();
  };
};

export default validateSchema;
