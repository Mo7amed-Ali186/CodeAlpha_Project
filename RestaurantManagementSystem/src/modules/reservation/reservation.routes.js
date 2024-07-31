import { Router } from "express";
import * as reservationController from "./controller/reservation.controller.js";
import * as reservationValidation from "./reservation.validation.js";
import auth from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import reservationEndPoint from "./reservation.endpoint.js";
const router = Router();
router
	.post(
		"/createReservation",
		validation(reservationValidation.tokenSchema, true),
		auth(reservationEndPoint.create),
		validation(reservationValidation.createReservationSchema),
		reservationController.createReservation,
	)
	.put(
		"/updateReservation/:id",
		validation(reservationValidation.tokenSchema, true),
		auth(reservationEndPoint.update),
		validation(reservationValidation.updateReservationSchema),
		reservationController.updateReservation,
	)
	.delete(
		"/cancel/:id",
		validation(reservationValidation.tokenSchema, true),
		auth(reservationEndPoint.delete),
		validation(reservationValidation.deleteReservationSchema),
		reservationController.deleteReservation,
	)
	.get(
		"/getReservation",
		validation(reservationValidation.tokenSchema, true),
		auth(reservationEndPoint.get),
		reservationController.getAllReservations,
	)
	.get(
		"/ReservationDetails/:id",
		validation(reservationValidation.tokenSchema, true),
		auth(reservationEndPoint.get),
		validation(reservationValidation.getReservationSchema),
		reservationController.getReservationDetails,
	);
	
export default router;
