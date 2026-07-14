import mongoose from "mongoose";
import User from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import Teacher from "../models/teacherModel.js";

const ALLOWED_SORT_KEYS = ['name', 'email', 'class', 'subject', 'createdAt']

export const addTeacher = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {


        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const {
            name,
            email,
            phone,
            password,
            photo,
            assignedClasses,
            subjects,
            qualification,
            experience,
            salary,
            joiningDate,
        } = req.body;

        const [teacherExist, phoneExist] = await Promise.all([
            User.findOne({ email }),
            User.findOne({ phone, schoolId: req.user.schoolId, role: "teacher" }),
        ]);

        if (teacherExist) {
            return errorResponse(res, 400, "Teacher with this email is already registered");
        }
        if (phoneExist) {
            return errorResponse(res, 400, "Teacher with this phone.no is already registered");
        }


        const [user] = await User.create(
            [
                {
                    name,
                    email,
                    phone,
                    password,
                    role: "teacher",
                    photo,
                    schoolId: req.user.schoolId,
                },
            ],
            { session }
        );

        const [teacher] = await Teacher.create([
            {
                userId: user._id,
                assignedClasses,
                subjects,
                qualification,
                experience,
                salary,
                joiningDate,
            },
        ],
            { session }
        );

        await session.commitTransaction();

        return successResponse(res, 201, "New user added", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                photo: user.photo,
            },
            teacher: {
                _id: teacher._id,
                userId: teacher.userId,
                assignedClasses: teacher.assignedClasses,
                subjects: teacher.subjects,
                qualification: teacher.qualification,
                experience: teacher.experience,
                salary: teacher.salary,
                joiningDate: teacher.joiningDate,
            }

        });

    } catch (error) {
        await session.abortTransaction();

        console.log("error from usercontroller.js - addTeacher", error.message);
        return errorResponse(res, 500, error.message);
    } finally {
        if (session) {
            session.endSession();
        }
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
                    { phone: { $regex: search, $options: 'i' } },
                ],
            }),
        };

        const [users, total] = await Promise.all([
            User.find(query)
                .sort({ [sortKey]: sortDir })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        //getting teachers profile for above fetched users
        const userIds = users.map((u) => u._id);
        const teachersProfiles = await Teacher.find({ userId: { $in: userIds } })
            .populate("assignedClasses", "name grade section")
            .lean();

        //merge user + teacher profile
        const teacherProfileMap = {};
        teachersProfiles.forEach((t) => {
            teacherProfileMap[t.userId.toString()] = t;
        })

        const teachers = users.map((u) => ({
            ...u,
            teacherProfile: teacherProfileMap[u._id.toString()] || null
        }))

        return successResponse(res, 200, "Teachers fetched successfully",
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

        const {
            name,
            email,
            phone,
            password,
            photo,
            assignedClasses,
            subjects,
            qualification,
            experience,
            salary,
            joiningDate,
        } = req.body;

        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const user = await User.findOne({
            _id: req.params.id,
            schoolId: req.user.schoolId,
            role: "teacher",
        });
        if (!user) return errorResponse(res, 404, "Teacher not found");

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

        const teacherUpdate = {
            ...(subjects && { subjects }),
            ...(assignedClasses && { assignedClasses }),
            ...(qualification && { qualification }),
            ...(experience && { experience }),
            ...(salary && { salary }),
            ...(joiningDate && { joiningDate }),
        };
        const teacher = await Teacher.findOneAndUpdate(
            { userId: user._id },
            teacherUpdate,
            { new: true },
        ).populate("assignedClasses", "name grade section");

        return successResponse(res, 200, "Teacher updated successfully", {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                photo: user.photo,
            },
            teacher,
        });

    } catch (error) {
        console.log("error from userController.js - editTeacher", error.message);
        return errorResponse(res, 500, error.message);
    }
}

export const deleteTeacher = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const user = await User.findOne({
            _id: req.params.id,
            schoolId: req.user.schoolId,
            role: "teacher"
        },
            { session }
        );
        if (!user) return errorResponse(res, 404, "Teacher not found");

        await User.findByIdAndDelete(user._id, { session });
        await Teacher.findOneAndDelete({ userId: user._id }, { session });
        await session.commitTransaction();

        return successResponse(res, 200, "Teacher deleted successfully");
    } catch (error) {
        await session.abortTransaction();
        console.log("error from usercontroller.js - deleteTeacher", error.message);
        return errorResponse(res, 500, error.message);
    } finally {
        if (session) {
            session.endSession();
        }
    }
}