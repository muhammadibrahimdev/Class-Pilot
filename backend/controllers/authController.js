import { School } from "../models/schoolModel.js";
import User from "../models/userModel.js"
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
    try {
        const { name, email, password, role, schoolName, schoolEmail, schoolPhone} = req.body;

        const userExist = await User.findOne({ email });

        if (userExist) {
            return errorResponse(res, 400, "Email already registered");
        }

        if (role === "schooladmin") {
            if (!schoolName || !schoolEmail || !schoolPhone) {
                return errorResponse(res, 400, "School name, email, and phone are required");
            }

            const schoolExist = await School.findOne({ email: schoolEmail });
            if (schoolExist) {
                return errorResponse(res, 400, "A school with this email already exists");
            }
        }

        const user = await User.create({ name, email, password, role });

        if (role === "schooladmin") {
            const school = await School.create({
                name: schoolName,
                email: schoolEmail,
                phone: schoolPhone,
                adminId: user._id,
            });

            user.schoolId = school._id;
            await user.save({ validateBeforeSave: false });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return successResponse(res, 201, "Registration successfull", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }

};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return errorResponse(res, 401, "Invalid email or password");
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return errorResponse(res, 401, "Invalid email or password");
        }

        if (!user.isActive) {
            return errorResponse(res, 401, "Your account has been deactivated");
        }

        const refreshToken = generateRefreshToken(user._id);
        const accessToken = generateAccessToken(user._id);

        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        return successResponse(res, 200, "Login successfull", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};


export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return errorResponse(res, 401, "Refresh token missing");
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id).select("+refreshToken");

        if (!user || user.refreshToken !== refreshToken) {
            return errorResponse(res, 401, "Invalid refresh token");
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        return successResponse(res, 200, "Token refreshed", {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};



export const logout = async (req, res) => {
    try {
        req.user.refreshToken = null;
        await req.user.save({ validateBeforeSave: false });
        return successResponse(res, 200, "Logged out successfully");
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}

export const getMe = async (req, res) => {
    try {
        return successResponse(res, 200, "User fetched", req.user);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}