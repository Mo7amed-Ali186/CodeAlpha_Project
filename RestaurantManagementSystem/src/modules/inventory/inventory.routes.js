import { Router } from "express";
import * as inventoryController from "./Controller/inventory.Controller.js";
import * as inventoryValidation from "./inventory.Validation.js";
import auth from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import inventoryEndPoint from "./inventory.endpoint.js";
const router = Router();
router
	.post(
		"/createInventory",
		validation(inventoryValidation.tokenSchema, true),
		auth(inventoryEndPoint.create),
		validation(inventoryValidation.createInventoryItemSchema),
		inventoryController.createNewInventoryItem,
	)
	.put(
		"/updateInventory/:id",
		validation(inventoryValidation.tokenSchema, true),
		auth(inventoryEndPoint.update),
		validation(inventoryValidation.updateInventoryItemSchema),
		inventoryController.updateInventoryItemDetails,
	)
	.delete(
		"/deleteInventory/:id",
		validation(inventoryValidation.tokenSchema, true),
		auth(inventoryEndPoint.delete),
		validation(inventoryValidation.deleteInventoryItemSchema),
		inventoryController.deleteInventoryItem,
	)
	.get(
		"/getAII",
		validation(inventoryValidation.tokenSchema, true),
		auth(inventoryEndPoint.get),
		inventoryController.getAllInventoryItems,
	)
	.get(
		"/InventoryDetails/:id",
		validation(inventoryValidation.tokenSchema, true),
		auth(inventoryEndPoint.get),
		validation(inventoryValidation.getAllInventoryItemSchema),
		inventoryController.getInventoryItemDetails,
	);
export default router;