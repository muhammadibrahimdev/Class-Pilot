import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const teacherSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
        },
        assignedClasses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Class',
                default: null,
            }
        ],
        joiningDate: {
            type: Date,
            default: Date.now
        },
        experience: {
            type: Number,
            default: 0,
        },
        salary: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);



const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;