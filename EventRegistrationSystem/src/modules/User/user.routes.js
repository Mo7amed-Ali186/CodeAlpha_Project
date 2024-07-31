import { Router } from "express";
import * as userController from "./controller/user.controller.js";
import * as userValidation from "./user.validation.js";
import validation from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import userEndPoint from "./user.endPoint.js";

const router = Router();

router
	//update account.
	.put(
		"/",
		validation(userValidation.tokenSchema, true),
		auth(userEndPoint.update),
		validation(userValidation.userUpdateSchema),
		userController.updateAccount,
	)
	//Get user account data
	.get(
		"/getUserAccountData",
		validation(userValidation.tokenSchema, true),
		auth(userEndPoint.create),
		validation(userValidation.userAccountDataSchema),
		userController.getUserAccountData,
	)
	//delete Account
	.delete(
		"/deleteAccount",
		validation(userValidation.tokenSchema, true),
		auth(userEndPoint.delete),
		userController.deleteAccount,
	);
export default router;
