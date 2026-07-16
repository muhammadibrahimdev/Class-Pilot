import mongoose from "mongoose";
import { Attendance } from "../models/attendanceModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { Class } from "../models/classModel.js";
import { Student } from "../models/studentModel.js";

const ALLOWED_SORT_KEYS = ["date", "status"];

const normalizeDate = (input) => {
    const d = new Date(input);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const hasClassAccess = (classDoc, user) => {
    if (!classDoc) return false;
    if (["schooladmin", "superadmin"].includes(user.role)) return true;
    if (classDoc.classTeacher && classDoc.classTeacher.toString() === user._id.toString()) return true;
    if (Array.isArray(classDoc.subjects)) {
        return classDoc.subjects.some(
            (s) => s.teacher && s.teacher.toString() === user._id.toString()
        );
    }
    return false;
};

export const markAttendance = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const { classId, date, attendance } = req.body;

        if (!classId || !date || !Array.isArray(attendance) || attendance.length === 0) {
            return errorResponse(res, 400, "classId, date, and a non-empty attendance array are required");
        }

        const classDoc = await Class.findOne({ _id: classId, schoolId: req.user.schoolId }).session(session);
        if (!classDoc) return errorResponse(res, 404, "Class not found");

        if (req.user.role === "teacher" && !hasClassAccess(classDoc, req.user)) {
            return errorResponse(res, 403, "You do not have access to this class");
        }

        const normalizedDate = normalizeDate(date);

        const alreadyMarked = await Attendance.exists({
            classId,
            schoolId: req.user.schoolId,
            date: normalizedDate,
        }).session(session);

        if (alreadyMarked) {
            return errorResponse(
                res,
                409,
                "Attendance already marked for this class on this date. Use PATCH /attendance/:id to correct individual records."
            );
        }

        const studentIds = attendance.map((a) => a.studentId);
        const uniqueIds = new Set(studentIds.map(String));
        if (uniqueIds.size !== studentIds.length) {
            return errorResponse(res, 400, "Duplicate studentId entries in attendance payload");
        }

        const validStudents = await Student.find({
            _id: { $in: studentIds },
            classId,
            schoolId: req.user.schoolId,
        })
            .select("_id")
            .session(session);

        if (validStudents.length !== studentIds.length) {
            return errorResponse(res, 400, "One or more students do not belong to this class");
        }

        const docs = attendance.map((a) => ({
            schoolId: req.user.schoolId,
            classId,
            studentId: a.studentId,
            markedBy: req.user._id,
            date: normalizedDate,
            status: a.status,
            remarks: a.remarks || null,
        }));

        const created = await Attendance.insertMany(docs, { session, ordered: true });

        await session.commitTransaction();

        return successResponse(res, 201, "Attendance marked successfully", {
            classId,
            date: normalizedDate,
            count: created.length,
        });
    } catch (error) {
        await session.abortTransaction();
        console.log("error from attendanceController.js - markAttendance", error.message);
        return errorResponse(res, 500, error.message);
    } finally {
        session.endSession();
    }
};

export const updateAttendance = async (req, res) => {
    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account")
        }
        const { status, remarks } = req.body;

        if (status && !['present', 'absent', 'leave', 'late'].includes(status)) {
            return errorResponse(res, 400, "Invalid status");
        };

        const record = await Attendance.findOne({ _id: req.params.id, schoolId: req.user.schoolId });
        if (!record) return errorResponse(res, 404, "Attendance record not found");

        if (req.user.role === "teacher") {
            const classDoc = await Class.findOne({ _id: record.classId, schoolId: req.user.schoolId });
            if (!hasClassAccess(classDoc, req.user)) {
                return errorResponse(res, 403, "You do not have access to this class");
            }
        }

        if (status) record.status = status;
        if (remarks !== undefiend) record.remarks = remarks;
        record.markedBy = req.user._id;

        await record.save();

        return successResponse(res, 200, "Attendance updated succesfully", record);

    } catch (error) {
        await session.abortTransaction();
        console.log("error from attendanceController.js - updateAttendance", error.message);
        return errorResponse(res, 500, error.message);
    }
}

export const getClassAttendance = async (req, res) => {
    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account")
        }

        const { classId, date } = req.query;

        if (!classId || !date) return errorResponse(res, 400, "classId and date are required");

        const classDoc = await Class.findOne({ _id: classId, schoolId: req.user.schoolId });
        if (!classDoc) return errorResponse(res, 404, "Class not found");

        if (req.user.role === "teacher" && !hasClassAccess(classDoc, req.user)) {
            return errorResponse(res, 403, "You do not have access to this class")
        }

        const normalizedDate = normalizeDate(date);

        const records = await Attendance.find({
            classId,
            schoolId: req.user.schoolId,
            date: normalizedDate
        })
            .populate({
                path: 'studentId',
                select: 'rollNumber userId',
                populate: { path: 'userId', select: 'name photo' },
            })
            .lean();

        return successResponse(res, 200, "Class attendance fetched successfully", {
            classId,
            date: normalizedDate,
            marked: records.length > 0,
            records,
        });

    } catch (error) {
        console.log("error from attendanceController.js - getClassAttendance", error.message);
        return errorResponse(res, 500, error.message);
    }
}

export const getStudentAttendance = async (req, res) => {
    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const student = await Student.findOne({ _id: req.params.id, schoolId: req.user.schoolId });
        if (!student) return errorResponse(res, 404, "Student not found");

        const page = Math.max(1, req.query.page || 1);
        const limit = Math.min(50, Math.max(1, req.query.limit || 20));
        const sortDir = req.query.sortDir === "asc" ? 1 : -1;
        const sortKey = ALLOWED_SORT_KEYS.includes(req.query.sortKey) ? req.query.sortKey : 'date';

        const query = { schoolId: req.user.schoolId, studentId: req.params.id };

        if (req.query.from || req.query.to) {
            query.date = {};
            if (req.query.from) query.date.$gte = normalizeDate(req.query.from);
            if (req.query.to) query.date.$lte = normalizeDate(req.query.to);
        }

        cosnt[records, total] = await Promise.all([
            Attendance.find(query)
                .sort({ [sortKey]: sortKey })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("classId", "className grade section")
                .lean(),
            Attendance.countDocuments(query),
        ])

        return successResponse(res, 200, "Student atendance fetched successfully", {
            records,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {
        console.log("error from attendanceController.js - getStudentAttendance", error.message);
        return errorResponse(res, 500, error.message);
    }
}

export const getAttendanceReport = async (req, res) => {
    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const { classId, from, to } = req.query;
        if (!classId || !from || !to) {
            return errorResponse(res, 400, "classId, from, and to are required");
        }

        const classDoc = await Class.findOne({ _id: classId, schoolId: req.user.schoolId });
        if (!classDoc) return errorResponse(res, 404, "Class not found");

        if (req.user.role === "teacher" && !hasClassAccess(classDoc, req.user)) {
            return errorResponse(res, 403, "You do not have access to this class");
        }

        const fromDate = normalizeDate(from);
        const toDate = normalizeDate(to);


        const summary = await Attendance.aggregate([
            {
                $match: {
                    schoolId: new mongoose.Types.ObjectId(req.user.schoolId),
                    classId: new mongoose.Types.ObjectId(classId),
                    date: { $gte: fromDate, $lte: toDate },
                },
            },
            {
                $group: {
                    _id: "$studentId",
                    present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
                    absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
                    late: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } },
                    leave: { $sum: { $cond: [{ $eq: ["$status", "leave"] }, 1, 0] } },
                    totalMarked: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "_id",
                    as: "student",
                },
            },
            { $unwind: "$student" },
            {
                $lookup: {
                    from: "users",
                    localField: "student.userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    studentId: "$_id",
                    name: "$user.name",
                    rollNumber: "$student.rollNumber",
                    present: 1,
                    absent: 1,
                    late: 1,
                    leave: 1,
                    totalMarked: 1,
                    attendancePercentage: {
                        $cond: [
                            { $eq: ["$totalMarked", 0] },
                            0,
                            { $round: [{ $multiply: [{ $divide: ["$present", "$totalMarked"] }, 100] }, 1] },
                        ],
                    },
                },
            },
            { $sort: { name: 1 } },
        ]);

        return successResponse(res, 200, "Attendance report generated successfully", {
            classId,
            from: fromDate,
            to: toDate,
            summary,
        });

    } catch (error) {
        console.log("error from attendanceController.js - getAttendanceReport", error.message);
        return errorResponse(res, 500, error.message);
    }
}

export const deleteAttendance = async (req, res) => {
    try {
        if (!req.user.schoolId) {
            return errorResponse(res, 403, "No school associated with your account");
        }

        const record = await Attendance.findOne({ _id: req.params.id, schoolId: req.user.schoolId });
        if (!record) return errorResponse(res, 404, "Attendance record not found");

        if (req.user.role === "teacher") {
            const classDoc = await Class.findOne({ _id: record.classId, schoolId: req.user.schoolId });
            if (!hasClassAccess(classDoc, req.user)) {
                return errorResponse(res, 403, "You do not have access to this class");
            }
        }

        await Attendance.deleteOne({ _id: record._id });

        return successResponse(res, 200, "Attendance record deleted successfully");
    } catch (error) {
        console.log("error from attendanceController.js - deleteAttendance", error.message);
        return errorResponse(res, 500, error.message);
    }
}