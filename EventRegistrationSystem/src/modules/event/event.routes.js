import { Router } from "express";
import * as eventController from "./controller/event.controller.js";
import * as eventValidation from "./event.validation.js";
import validation from "../../middleware/validation.js";
import eventEndPoint from "./event.endPoint.js";
import auth from "../../middleware/auth.js";
const router = Router();
router
	.post(
		"/addEvent",
		validation(eventValidation.tokenSchema, true),
		auth(eventEndPoint.create),
		validation(eventValidation.createEventSchema),
		eventController.CreateNewEvent,
	)
	.put(
		"/updateEvent/:id",
		validation(eventValidation.tokenSchema, true),
		auth(eventEndPoint.update),
		validation(eventValidation.updateEventSchema),
		eventController.updateEventDetails,
	)
	.delete(
		"/deleteEvent/:id",
		validation(eventValidation.tokenSchema, true),
		auth(eventEndPoint.delete),
		validation(eventValidation.deleteEventSchema),
		eventController.deleteEvent,
	)
	.get(
		"/getAll",
		auth(eventEndPoint.create),
		eventController.getAllEvents,
	)
	.get(
		"/getEventDetails/:id",
		auth(eventEndPoint.create),
		eventController.getEventDetails,
	);
export default router;
