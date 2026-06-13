import { validationResult } from "express-validator"
import { errorResponse } from "../utils/apiResponse";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array()[0].msg);
    }
    next();
};

export default validate;