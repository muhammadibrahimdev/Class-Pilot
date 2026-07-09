import { School } from "../models/schoolModel.js"
import { errorResponse, successResponse } from "../utils/apiResponse.js"

// @desc    Get all schools pending approval
// @route   GET /api/schools/pending
// @access  Super Admin
export const getPendingSchools = async (req, res) => {
    try {
        const schools = await School.find({ isApproved: false })
            .populate("adminId", "name email")
            .sort({ createdAt: -1 })

        return successResponse(res, 200, "Pending schools fetched", schools);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

// @desc    Get all approved/active schools
// @route   GET /api/schools
// @access  Super Admin
export const getAllSchools = async (req, res) => {
    try {
        const schools = await School.find({ isApproved: true })
            .populate("adminId", "name email")
            .sort({ createdAt: -1 })

        return successResponse(res, 200, "Schools Fetched", schools);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}

// @desc    Approve a school
// @route   PATCH /api/schools/:id/approve
// @access  Super Admin
export const approveSchool = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);

        if (!school) {
            return errorResponse(res, 404, "School not found");
        }

        school.isApproved = true;
        await school.save();

        return successResponse(res, 200, "School Approved Successfully", school);
    } catch (error) {
      return  errorResponse(res, 500, error.message);
    }
};

// @desc    Reject a school (delete request)
// @route   DELETE /api/schools/:id/reject
// @access  Super Admin
export const rejectSchool = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);

        if (!school) {
            return errorResponse(res, 404, "School not found");
        }

        await school.deleteOne();
        return successResponse(res, 200, "School request rejected");
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};


// @desc    Get Super Admin dashboard stats
// @route   GET /api/schools/stats
// @access  Super Admin
export const getSchoolStats = async (req, res) => {
    try {
        const totalSchools = await School.countDocuments({ isApproved: true });
        const pendingRequests = await School.countDocuments({ isApproved: false });
        const activeSubscriptions = await School.countDocuments({
            isApproved: true,
            isActive: true,
        });

        return successResponse(res, 200, "Stats fetched", {
            totalSchools,
            pendingRequests,
            activeSubscriptions,
        });
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
};

// @desc    Get single school details
// @route   GET /api/schools/:id
// @access  Super Admin / School Admin (own school)
export const getSchoolById = async (req, res) => {
    try {
        const school = await School.findById(req.params.id)
            .populate("adminId", "name email");

        if (!school) {
            return errorResponse(res, 404, "School not found");
        }

        return successResponse(res, 200, "School fetched", school);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}