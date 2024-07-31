import { Router } from "express";
import * as reportController from "./controller/report.controller.js";
import * as reportValidation from "./report.Validation.js";
import auth from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import reportEndPoint from "./report.endpoint.js";
const router = Router();
router
	.post(
		"/sales",
		validation(reportValidation.tokenSchema, true),
		auth(reportEndPoint.get),
		validation(reportValidation.generateReportSchema),
		reportController.generateSalesReport,
	).post(
		"/inventory",
		validation(reportValidation.tokenSchema, true),
		auth(reportEndPoint.get),
		validation(reportValidation.generateReportSchema),
		reportController.generateInventoryReport,
	).post(
		"/reservation",
		validation(reportValidation.tokenSchema, true),
		auth(reportEndPoint.get),
		validation(reportValidation.generateReportSchema),
		reportController.generateReservationReport,
	)
;
export default router;