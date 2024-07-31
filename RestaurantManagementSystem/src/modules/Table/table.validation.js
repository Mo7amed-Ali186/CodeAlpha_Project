import Joi from 'joi';
import { generalFields } from "../../utils/generalFields.js";

export const createTableSchema = Joi.object({
  number: Joi.number().positive().required(),
  capacity: Joi.number().positive().required(),
}).required();

export const updateTableSchema = Joi.object({
  id: generalFields.id.required(),
  number: Joi.number().positive(),
  capacity: Joi.number().positive(),
  status: Joi.string().valid('Available', 'Occupied', 'Reserved'),
}).min(1).required();

export const deleteTableSchema = Joi.object({
    id: generalFields.id.required(),
}).required();

export const getAllTableSchema = Joi.object({
    id: generalFields.id.required(),
}).required();

export const tokenSchema = Joi
	.object({
		authorization: Joi.string().required(),
	})
	.required();