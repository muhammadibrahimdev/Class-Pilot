import User from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

export const addTeacher = async (req, res) => {
    try {
        const { name, email, phone, password, role, assignedClass, subject, } = req.body;
        const teacherExist = await User.findOne({ email: email });
        const phoneExist = await User.findOne({ phone: phone });

        if (teacherExist) {
            return errorResponse(res, 400, "Teacher with this email is already registered");
        }
        if (phoneExist) {
            return errorResponse(res, 400, "Teacher with this phone.no is already registered");
        }
        const user = await User.create({
            name,
            email,
            phone,
            password,
            assignedClass ,  // ADD
            subject,
            role: "teacher",
            schoolId: req.user.schoolId,
        });


        return successResponse(res, 201, "New teacher added", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                class: user.class,
                subject: user.subject,
                assignedClass: user.assignedClass,
                role: user.role,
            }
        })
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}

export const getAllTeachers = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortKey = 'name', sortDir = 'asc', search = '' } = req.query;

        const query = {
            schoolId: req.user.schoolId,
            role: 'teacher',
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } },
                ],
            }),
        };

        const [teachers, total] = await Promise.all([
            User.find(query)
                .sort({ [sortKey]: sortDir === 'asc' ? 1 : -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit)),
            User.countDocuments(query),
        ]);

        return successResponse(
            res,
            200,
            "Teachers fetched successfully",
            {
                teachers,
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            }
        );
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }

}