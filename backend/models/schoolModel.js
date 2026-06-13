const schoolModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "School name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            province: { type: String, trim: true },
            country: { type: String, default: "Pakistan" },
        },
        logo: {
            type: String,
            default: null,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        plan: {
            type: String,
            enum: ["basic", "pro"],
            default: basic,
        },
        planExpiresAt: {
            type: Date,
            default: null,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        studentLimit: {
            type: Number,
            default: 200,
        },
        totalStudents: {
            type: Number,
            default: 0,
        },
        stripeCustomerId: {
            type: String,
            default: null,
            select: false,
        },
        stripeSubscriptionId: {
            type: String,
            default: null,
            select: false
        },
    },
    {
        timestamps: true
    }
);

schoolSchema.pre("save", async function (next) {
    if (this.isModified("plan")) {
        this.studentLimit = this.plan === "pro" ? 999999 : 200;
    };
    next();
});

export const School = mongoose.model("School", schoolSchema);