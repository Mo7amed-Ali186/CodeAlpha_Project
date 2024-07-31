import Joi from 'joi';
import { generalFields } from "../../utils/generalFields.js";

export const createOrderSchema = Joi.object({
  reservation: Joi.string().length(24).hex().required(),
  items: Joi.array().items(
    Joi.object({
      menuItem: Joi.string().length(24).hex().required(),
      quantity: Joi.number().positive().required(),
    })
  ).required(),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed', 'Cancelled').optional(),
}).required();

export const updateOrderSchema = Joi.object({
  id: generalFields.id.required(),
  reservation: Joi.string().length(24).hex(),
  items: Joi.array().items(
    Joi.object({
      menuItem: Joi.string().length(24).hex(),
      quantity: Joi.number().positive(),
    })
  ),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed', 'Cancelled'),
}).min(1).required();

export const deleteOrderSchema = Joi.object({
    id: generalFields.id.required(),
}).required();

export const getAllOrderSchema = Joi.object({
  id: generalFields.id.required(),
}).required();

export const tokenSchema = Joi
	.object({
		authorization: Joi.string().required(),
	})
	.required();