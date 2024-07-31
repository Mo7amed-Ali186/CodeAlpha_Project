import { Router } from "express";
import * as registerController from "./controller/reg.controller.js";
import auth from "../../middleware/auth.js";
import registerEndPoint from "./reg.endPoint.js";
const router = Router();
router
	.post(
		"/registerEvent",
		auth(registerEndPoint.create),
		registerController.registerForEvent,
	)
	.delete(
		"/cancel",
		auth(registerEndPoint.delete),
		registerController.cancelRegistration,
	)
	.get(
		"/getUR",
		auth(registerEndPoint.get),
		registerController.getUserRegistrations,
	)
	.get(
		"/getER/:eventId",
		// auth(registerEndPoint.get),
		registerController.getEventRegistrations,
	)
export default router;
