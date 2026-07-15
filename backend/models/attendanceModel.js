import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        status: {
            type: String,
            enum: ["present", "absent", "late", "leave"],
            required: true,
        },
        remarks: {
            type: String,
            default: null,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index(
    { studentId: 1, classId: 1, date: 1 , schoolId: 1},
    { unique: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);