import User from "../models/userModel.js";
import { errorResponse } from "../utils/apiResponse.js";
import jwt from 'jsonwebtoken'

export const protect = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return errorResponse(res, 401, "Not Authorized, token missing");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return errorResponse(res, 401, "User not found");
        }

        if (!req.user.isActive) {
            return errorResponse(res, 401, "Account is deactivated");
        }

        next();

    } catch (error) {
        return errorResponse(res, 401, "Not authorized, invalid token");
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
           return errorResponse(res, 403, `Role ${req.user.role} is not allowed to access this route`)
        };
        next();
    };
};