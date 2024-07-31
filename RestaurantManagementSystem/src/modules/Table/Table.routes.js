import { Router } from "express";
import * as tableController from "./controller/Table.controller.js";
import * as tableValidation from "./table.validation.js";
import auth from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import tableEndPoint from "./table.endpoint.js";
const router = Router();
router
	.post(
		"/createTable",
		validation(tableValidation.tokenSchema, true),
		auth(tableEndPoint.create),
		validation(tableValidation.createTableSchema),
		tableController.createTable,
	)
	.put(
		"/updateTable/:id",
		validation(tableValidation.tokenSchema, true),
		auth(tableEndPoint.update),
		validation(tableValidation.updateTableSchema),
		tableController.updateTable,
	)
	.delete(
		"/delete/:id",
		validation(tableValidation.tokenSchema, true),
		auth(tableEndPoint.delete),
		validation(tableValidation.deleteTableSchema),
		tableController.deleteTable,
	)
	.get(
		"/getTables",
		validation(tableValidation.tokenSchema, true),
		auth(tableEndPoint.get),
		tableController.getAllTables,
	)
	.get(
		"/tableDetails/:id",
		validation(tableValidation.tokenSchema, true),
		auth(tableEndPoint.get),
		validation(tableValidation.getAllTableSchema),
		tableController.getTableDetails,
	);
export default router;