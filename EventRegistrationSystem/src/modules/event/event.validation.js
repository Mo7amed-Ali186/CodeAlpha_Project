import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const createEventSchema = joi
	.object({
		title: generalFields.title,
		description: generalFields.description.required(),
		date: generalFields.date.required(),
		location: generalFields.location.required(),
	})
	.required();

export const updateEventSchema = joi
	.object({
		id: generalFields.id.required(),
		title: generalFields.title,
		description: generalFields.description,
		date: generalFields.date,
		location: generalFields.location,
	})
	.required();

export const deleteEventSchema = joi
	.object({
		id: generalFields.id.required(),
	})
	.required();

export const tokenSchema = joi
	.object({
		authorization: joi.string().required(),
	})
	.required();
