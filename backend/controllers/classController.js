import { Class } from "../models/classModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";


const ALLOWED_SORT_KEYS = ['name', 'grade', 'section', 'createdAt'];

export const createClass = async (req, res) => {
    try {
        const { className, grade, section, subjects } = req.body;

        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const classExists = await Class.findOne
            ({
                className,
                grade,
                section,
                schoolId: req.user.schoolId
            });

        if (classExists) return errorResponse(res, 400, "Class already exists");

        const newClass = await Class.create({
            schoolId: req.user.schoolId,
            className,
            grade,
            section,
            subjects: subjects || [],
        });

        return successResponse(res, 200, "Class created successfully", newClass);
    } catch (error) {
        console.log("error from classController.js - createClass ", error.message);
        return errorResponse(res, 500, error.message);
    }
};

export const getAllClasses = async (req, res) => {
    try {

        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
        const search = req.query.search || "";

        const sortKey = ALLOWED_SORT_KEYS.includes(req.query.sortKey) ? req.query.sortKey : 'grade'
        const sortDir = req.query.sortDir === "asc" ? 1 : -1;

        const query = {
            schoolId: req.user.schoolId,
            ...(search && {
                $or: [
                    { className: { $regex: search, $options: 'i' } },
                    { grade: { $regex: search, $options: 'i' } },
                    { section: { $regex: search, $options: 'i' } },
                ]
            })
        };

        const [classes, total] = await Promise.all([
            Class.find(query)
                .populate("classTeacher", "name email photo")
                .populate("subjects.teacher", "name email")
                .sort({ [sortKey]: sortDir })
                .skip((page - 1) * limit)
                .limit(limit),

            Class.countDocuments(query),
        ])

        return successResponse(res, 200, "All classes fetched successfully",
            {
                classes,
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            })

    } catch (error) {
        console.log("error from classController.js - getAllClasses ", error.message);
        return errorResponse(res, 500, error.message);
    }
};

export const getClassById = async (req, res) => {
    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const classData = await Class.findOne({
            _id: req.params.id,
            schoolId: req.user.schoolId
        })
            .populate("classTeacher", "name email")
            .populate("subjects.teacher", "name");

        if (!classData) return errorResponse(res, 404, "Class not found");

        return successResponse(res, 200, "Class fetched successfully", classData);
    } catch (error) {
        console.log("error from classController.js - getClassById ", error.message);
        return errorResponse(res, 500, error.message);
    }
}

export const updateClass = async (req, res) => {
    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const { className, grade, section } = req.body;
        const classExists = await Class.findOne({
            grade,
            section,
            _id: { $ne: req.params.id },
            schoolId: req.user.schoolId,
        })
        if (!classExists) return errorResponse(res, 404, "Class not found");

        const filter = {
            _id: req.params.id,
            schoolId: req.user.schoolId,
        }
        const updatedData = {
            className, grade, section,
        }
        const updatedClass = await Class.findOneAndUpdate(filter, updatedData, {new: true});

        return successResponse(res, 200, "Class updated", updatedClass);
    } catch (error) {
        console.log("error from classController.js - updateClass ", error.message);
        return errorResponse(res, 500, error.message);
    }
}