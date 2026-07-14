import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    rollNumber: {
        type: String,
        required: true,
        trim: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: null,
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        default: null,
    },
    emergencyContact: {
        name: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        relation: {
            type: String,
            trim: true,
        },
    },
    admissionDate: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
},
    { timestamps: true, }
)

studentSchema.index({ rollNumber: 1, schoolId: 1 }, { unique: true });

export const Student = mongoose.model("Student", studentSchema);