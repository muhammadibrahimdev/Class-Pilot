// ✅ bulkMarkAttendance (main feature)
// ✅ getClassAttendance
// ✅ updateAttendance
// ✅ deleteAttendance
// ✅ getStudentAttendance
// ✅ getAttendanceReport
// ✅ getAttendanceById
// ✅ getStudentMonthlyAttendance

import mongoose from "mongoose";
import { Attendance } from "../models/attendanceModel.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { Class } from "../models/classModel.js";
import { Student } from "../models/studentModel.js";

// const ALLOWED_SORT_KEYS = ["date", "status"];


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
