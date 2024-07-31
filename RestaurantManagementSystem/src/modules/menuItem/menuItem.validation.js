import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createMenuItemSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: generalFields.description,
    price: Joi.number().positive().required(),
    category: Joi.string().valid('Appetizer', 'Main Course', 'Dessert', 'Beverage').required(),
    available: Joi.boolean().optional()
}).required();

export const updateMenuItemSchema = Joi.object({
    id: generalFields.id.required(),
    description: generalFields.description.required(),
    description: Joi.string().min(10).max(500),
    price: Joi.number().positive(),
    category: Joi.string().valid('Appetizer', 'Main Course', 'Dessert', 'Beverage'),
    available: Joi.boolean().optional()
}).min(1).required(); // At least one field is required to update

export const deleteMenuItemSchema = Joi.object({
    id: generalFields.id.required(),
}).required();
export const getAllMenuItemsSchema = Joi.object({
    id: generalFields.id.required(),
}).required();
export const tokenSchema = Joi
	.object({
		authorization: Joi.string().required(),
	})
	.required();