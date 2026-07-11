import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        phone: {
            type: String,
            // unique: true,
            // required: [true, "Phone number is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
        },
        role: {
            type: String,
            enum: ["superadmin", "schooladmin", "teacher", "student", "parent"],
            default: "parent",
        },
        // subjects: {
        //     type: String,
        //     default: null,
        // },
        assignedClass: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        // photo: {
        //     type: String,
        //     default: null,
        // },
        isActive: {
            type: Boolean,
            default: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
            default: null,
            select: false,
        },
        passwordRefreshToken: {
            type: String,
            default: null,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            default: null,
            select: false
        },
        lastLogin: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);

})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;