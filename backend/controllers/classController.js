import { Class } from "../models/classModel";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

export const createClass = async(req, res) => {
    try{
        const  { className, grade, section, subjects } = req.body;
        const classExists = await Class.findOne({className, grade, section, schoolId: req.user.schoolId});

        if(classExists) return errorResponse(res, 400, "Class already exists");

       const newClass =  await Class.create({
            schoolId: req.user.schoolId,
            className,
            grade,
            section,
            subjects,
        })
        successResponse(res, 200, "Class created successfully", newClass);
    }catch(error){
        console.log("error from classController.js - createClass", error.message);
        return errorResponse(res, 500, error.message);
    }
}