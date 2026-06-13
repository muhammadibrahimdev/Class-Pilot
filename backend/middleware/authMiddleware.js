import User from "../models/userModel";
import { errorResponse } from "../utils/apiResponse";

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
            errorResponse(res, 401, "Not Authorized, token missing");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findbyId(decoded.id).select("-password");

        if (!req.user) {
            return errorResponse(res, 401, "User not found");
        }

        if (!req.user.isActive) {
            errorResponse(res, 401, "Account is deactivated");
        }

    }catch(error){
       return errorResponse(res, 401, "Not authorized, invalid token");
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
            errorResponse(res, 403, `Role ${req.user.role} is not allowed to access this route`)
        };
        next();
    };
};