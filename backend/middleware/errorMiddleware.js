const errorMiddleware = (err, req, res, next) => {
    let message = err.message || "Internal Server Error";
    let statusCode = err.statusCode || 500;

    // Mongoose duplication error
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    //Mongoose Validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(", ");
    }

    //JWT Errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid Token";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorMiddleware;