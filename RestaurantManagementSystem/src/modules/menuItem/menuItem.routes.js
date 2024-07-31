import { Router } from "express";
import * as menuItemController from "./controller/menuItem.controller.js";
import * as menuItemValidation from "./menuItem.validation.js";
import auth from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import menuItemEndPoint from "./menuItem.endpoint.js";
const router = Router();
router
	.post(
		"/createMenu",
		validation(menuItemValidation.tokenSchema, true),
		auth(menuItemEndPoint.create),
		validation(menuItemValidation.createMenuItemSchema),
		menuItemController.createNewMenuItem,
	)
	.put(
		"/updateMenu/:id",
		validation(menuItemValidation.tokenSchema, true),
		auth(menuItemEndPoint.update),
		validation(menuItemValidation.updateMenuItemSchema),
		menuItemController.updateMenuItemDetails,
	)
	.delete(
		"/deleteMenu/:id",
		validation(menuItemValidation.tokenSchema, true),
		auth(menuItemEndPoint.delete),
		validation(menuItemValidation.deleteMenuItemSchema),
		menuItemController.deleteMenuItem,
	)
	.get(
		"/getAMI",
		validation(menuItemValidation.tokenSchema, true),
		auth(menuItemEndPoint.get),
		menuItemController.getAllMenuItems,
	)
	.get(
		"/getMenuItemDetails/:id",
		validation(menuItemValidation.tokenSchema, true),
		auth(menuItemEndPoint.get),
		validation(menuItemValidation.getAllMenuItemsSchema),
		menuItemController.getMenuItemDetails,
	);
export default router;
