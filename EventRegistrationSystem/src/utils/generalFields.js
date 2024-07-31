import joi from "joi";
import { Types } from "mongoose";


export const validateObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message("Invalid Id");
};

export const generalFields = {
    email : joi.string().email({tlds:{allow:['com','net']}}),
    password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).required(),
    token : joi.string().required(),
    image: joi.optional(),
    id: joi.string().custom(validateObjectId).required(),
    _id: joi.string().custom(validateObjectId),
    // id: joi.string().regex(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId validation
    title: joi.string().min(2).max(50).required(),
    description: joi.string().min(5).max(500),
    date: joi.date().iso(),
    location: joi.string().min(2).max(100),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required(),
        // finalDest: joi.string().required(),
        
      }),

    files:joi.array().items(
        
        joi.object({
            size:joi.number().positive().required(),
            path:joi.string().required(),
            filename:joi.string().required(),
            destination:joi.string().required(),
            mimetype:joi.string().required(),
            encoding:joi.string().required(),
            originalname:joi.string().required(),
            fieldname:joi.string().required(),
            // finalDest:joi.string().required(),
        })
    )
    
    
}
