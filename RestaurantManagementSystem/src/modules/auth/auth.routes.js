import { Router } from "express";
import validation from "../../middleware/validation.js";
import * as authValidation from "./auth.validation.js";
import * as authController from "./controller/auth.controller.js";
const router = Router();
router
	.post(
		"/signUp",
		validation(authValidation.signUpSchema),
		authController.signUp,
	)
	.post(
		"/logIn",
		validation(authValidation.logInSchema),
		authController.logIn,
	)
	
export default router;
