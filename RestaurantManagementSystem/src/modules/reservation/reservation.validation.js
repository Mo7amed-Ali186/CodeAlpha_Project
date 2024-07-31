import Joi from 'joi';
import { generalFields } from "../../utils/generalFields.js";

export const createReservationSchema = Joi.object({
  table: Joi.string().length(24).hex().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().greater(Joi.ref('startTime')).required(),
  status: Joi.string().valid('Pending', 'Confirmed', 'Cancelled').optional(),
}).required();

export const updateReservationSchema = Joi.object({
  id: generalFields.id.required(),
  table: Joi.string().length(24).hex(),
  startTime: Joi.date().iso(),
  endTime: Joi.date().iso().greater(Joi.ref('startTime')),
  status: Joi.string().valid('Pending', 'Confirmed', 'Cancelled'),
}).min(1).required();

export const deleteReservationSchema = Joi.object({
  id: generalFields.id.required(),
}).required();

export const getReservationSchema = Joi.object({
  id: generalFields.id.required(),
}).required();

export const tokenSchema = Joi
  .object({
    authorization: Joi.string().required(),
  })
  .required();
