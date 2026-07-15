import mongoose from "mongoose";
import User from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { Student } from "../models/studentModel.js";

const ALLOWED_SORT_KEYS = ['name', 'email', 'phone', 'createdAt'];

export const addStudent = async (req, res) => {

    const session = mongoose.startSession();
    await session.startTransaction();

    try {
        const { name, email, phone, password, photo, rollNumber, dateOfBirth, admissionDate, gender, bloodGroup, emergencyContact, classId, parentId } = req.body;

        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }
        const studentExist = await User.findOne({ email });

        if (studentExist) return errorResponse(res, 400, "Student with this email is already registered");

        const [user] = await User.create([
            {
                name,
                email,
                phone,
                photo,
                password,
                role: 'student',
                schoolId: req.user.schoolId,
            }
        ],
            { session }
        );

        const [student] = await Student.create([
            {
                userId: user._id,
                schoolId: req.user.schoolId,
                parentId,
                rollNumber,
                dateOfBirth,
                gender,
                bloodGroup,
                emergencyContact,
                classId,
                admissionDate,
            },
        ],
            { session }
        );

        await session.commitTransaction();

        const populatedStudent = await student.populate("classId", "name grade section");
        return successResponse(res, 201, "New student created sucesfully", populatedStudent);

    } catch (error) {
        console.log("error from studentController.js - addStudent ", error.message);
        return errorResponse(res, 500, error.message);
    } finally {
        if (session) {
            session.endSession();
        }
    }
}

export const getStudentById = async (req, res) => {
    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const user = await User.findOne({
            _id: req.params.id,
            schoolId: req.user.schoolId,
            role: "student",
        }).lean();
        if (!user) return errorResponse(res, 400, "User not found");

        const student = await Student.findOne({
            userId: user._id,
            schoolId: req.user.schoolId,
        })
            .populate("classId", "className grade section")
            .populate("parentId", "name email phone")
            .lean();

        return successResponse(res, 200, "Student fetched successfully", {
            ...user,
            studentProfile: student,
        })

    } catch (error) {
        console.log("error from studentController.js - getStudentById ", error.message);
        return errorResponse(res, 500, error.message);
    }
}


export const getallStudents = async (req, res) => {
    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
        const search = req.query.search || "";
        const sortDir = req.query.sortDir === "asc" ? 1 : -1;
        const sortKey = ALLOWED_SORT_KEYS.includes(req.query.sortKey) ? req.query.sortKey : 'name';

        const query = {
            schoolId: req.user.schoolId,
            role: 'student',
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                ],
            }),
        };

        const [users, total] = await Promise.all([
            User.find(query)
                .sort({ [sortKey]: sortDir })
                .limit(limit)
                .skip((page - 1) * limit)
                .lean(),
            User.countDocuments(query),
        ]);


        const userdIds = users.map((u) => u._id);
        const studentsProfiles = await Student.find({ userId: { $in: userdIds } })
            .populate("classId", "className grade section")
            .lean();

        const studentProfileMap = {};
        studentsProfiles.forEach((s) => {
            studentProfileMap[s.userId.toString()] = s;
        })

        // merging student + user
        const students = users.map((u) => ({
            ...u,
            studentProfile: studentProfileMap[u._id.toString()] || null,
        }))

        return successResponse(res, 200, "All Students fetched successfully", {
            students,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.log("error from studentController.js - editStudent ", error.message);
        return errorResponse(res, 500, error.message);

    }

}


export const updateStudent = async (req, res) => {
    try {

        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const { name, email, phone, password, photo, rollNumber, dateOfBirth, admissionDate, gender, bloodGroup, emergencyContact, classId, parentId } = req.body;

        const user = await User.findOne({
            _id: req.params.id,
            schoolId: req.user.schoolId,
            role: 'student'
        });

        if (!user) return errorResponse(res, 400, "Student not found");

        if (name) user.name = name;
        if (password) user.password = password;
        if (phone) user.phone = phone;
        if (photo) user.photo = photo;
        if (email && email !== user.email) {
            const emailExist = await User.findOne({ email });
            if (emailExist) return errorResponse(res, 400, "Email already in use");
            user.email = email;
        }
        await user.save();

        const studentUpdated = {
            ...(rollNumber && { rollNumber }),
            ...(dateOfBirth && { dateOfBirth }),
            ...(gender && { gender }),
            ...(admissionDate && { admissionDate }),
            ...(bloodGroup && { bloodGroup }),
            ...(emergencyContact && { emergencyContact }),
            ...(classId && { classId }),
            ...(parentId && { parentId }),
        }

        const student = await Student.findOneAndUpdate(
            { userId: user._id },
            studentUpdated,
            { new: true },
        ).populate("classId", "className grade section")

        return successResponse(res, 200, "Student updated successfully", {
            user: {
                _id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                photo: user.photo,
            },
            student,
        });

    } catch (error) {
        console.log("error from studentController.js - updateStudent ", error.message);
        return errorResponse(res, 500, error.message);

    }
}


export const deleteStudent = async (req, res) => {
    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const user = await User.findOne({
            _id: req.params.id,
            schoolId: req.user.schoolId,
            role: "student"
        }).session(session);
        
        if (!user) return errorResponse(res, 404, "Student not found");

        await User.findByIdAndDelete(user._id, { session });
        await Student.findOneAndDelete({ userId: user._id }, { session });
        await session.commitTransaction();

        return successResponse(res, 200, "Student deleted successfully");
    } catch (error) {
        await session.abortTransaction();
        console.log("error from studentController.js - deleteStudent", error.message);
        return errorResponse(res, 500, error.message);
    } finally {
        if (session) {
            session.endSession();
        }
    }
}