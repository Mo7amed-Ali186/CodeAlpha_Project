import Joi from 'joi';

const dateSchema = Joi.date().iso();

export const generateReportSchema = Joi.object({
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional()
});
export const tokenSchema = Joi
	.object({
		authorization: Joi.string().required(),
	})
	.required();