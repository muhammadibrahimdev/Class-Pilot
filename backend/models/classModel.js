import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    className: {
        type: String,
        required: [true, "Class name is required"],
        trim: true,
    },
    grade: {
        type: String,
        required: [true, "Grade is required"],
        trim: true,
    },
    section: {
        type: String,
        required: [true, "Section is required"],
        trim: true,
    },
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    subjects: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: null,
            },
        }
    ],
    totalStudents: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true
    },

},
    {
        timestamps: true
    }
)

classSchema.index({grade: 1, section: 1, schoolId: 1}, {unique: true});

export const Class = mongoose.model('Class', classSchema);