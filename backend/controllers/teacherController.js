import User from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

const ALLOWED_SORT_KEYS = ['name', 'email', 'class', 'subject', 'createdAt']

export const addTeacher = async (req, res) => {
    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const { name, email, phone, password, role, assignedClass, subject, } = req.body;
        const teacherExist = await User.findOne({ email: email, schoolId: req.user.schoolId, role: "teacher" });
        const phoneExist = await User.findOne({ phone: phone, schoolId: req.user.schoolId, role: "teacher" });

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
            assignedClass,  // ADD
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
        console.log("error from usercontroller.js - addTeacher", error.message);
        return errorResponse(res, 500, error.message);
    }
}

export const getAllTeachers = async (req, res) => {
    try {

        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
        const search = req.query.search || "";

        const sortKey = ALLOWED_SORT_KEYS.includes(req.query.sortKey) ? req.query.sortKey : 'name';
        const sortDir = req.query.sortDir === "asc" ? 1 : -1;

        const query = {
            schoolId: req.user.schoolId,
            role: 'teacher',
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } },
                    { assignedClass: { $regex: search, $options: 'i' } },
                ],
            }),
        };

        const [teachers, total] = await Promise.all([
            User.find(query)
                .populate("assignedClasses", "name grade section")
                .sort({ [sortKey]: sortDir })
                .skip((page - 1) * limit)
                .limit(limit),
            User.countDocuments(query),
        ]);

        return successResponse(
            res,
            200,
            "Teachers fetched successfully",
            {
                teachers,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        );
    } catch (error) {
        console.log("error from usercontroller.js - getAllTeachers", error.message);
        return errorResponse(res, 500, error.message);
    }

}

export const editTeacher = async (req, res) => {
    try {

        const { name, email, phone, password, subject, assignedClass } = req.body;

        const teacher = await User.findOne({
            _id: req.params.id,
            schoolId: req.user.schoolId,
            role: "teacher",
        });
        if (!teacher) return errorResponse(res, 404, "Teacher not found");

        if (name) teacher.name = name;
        if (email) teacher.email = email;
        if (phone) teacher.phone = phone;
        if (subject) teacher.subject = subject;
        if (assignedClass) teacher.assignedClass = assignedClass;
        if (password) teacher.password = password;

        await teacher.save();

        return successResponse(res, 200, "Teacher updated successfully", teacher);

    } catch (error) {
        console.log("error from userController.js - editTeacher", error.message);
        return errorResponse(res, 500, error.message);
    }
}

export const deleteTeacher = async (req, res) => {
    try {
        const teacher = await User.findById(req.params.id);
        if (!teacher) return errorResponse(res, 404, "Teacher not found");
        if (teacher.role !== "teacher") return errorResponse(res, 400, "User is not a teacher");

        await User.findByIdAndDelete(req.params.id);
        return successResponse(res, 200, "Teacher is deleted");
    } catch (error) {
        console.log("error from usercontroller.js - deleteTeacher", error.message);
        return errorResponse(res, 500, error.message);
    }
}