import Joi from 'joi';
import { generalFields } from '../../utils/generalFields.js';

export const createInventoryItemSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    quantity: Joi.number().positive().required(),
    price: Joi.number().positive().required(),
    category: Joi.string().required(),
    supplier: Joi.string().optional(),
    expirationDate: Joi.date().optional(),
}).required();

export const updateInventoryItemSchema = Joi.object({
    id: generalFields.id.required(),
    name: Joi.string().min(3).max(100),
    quantity: Joi.number().positive(),
    price: Joi.number().positive(),
    category: Joi.string(),
    supplier: Joi.string(),
    expirationDate: Joi.date(),
}).min(1).required(); 

export const deleteInventoryItemSchema = Joi.object({
    id: generalFields.id.required(),
}).required();

export const getAllInventoryItemSchema = Joi.object({
    id: generalFields.id.required(),
}).required();
export const tokenSchema = Joi
	.object({
		authorization: Joi.string().required(),
	})
	.required();