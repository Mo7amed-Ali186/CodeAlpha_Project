import { Router } from "express";
import * as orderController from "./controller/Order.controller.js";
import * as OrderValidation from "./Order.validation.js";
import auth from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import orderEndPoint from "./Order.endpoint.js";
const router = Router();
router
	.post(
		"/createOrder",
		validation(OrderValidation.tokenSchema, true),
		auth(orderEndPoint.create),
		validation(OrderValidation.createOrderSchema),
		orderController.createOrder,
	)
	.put(
		"/updateOrder/:id",
		validation(OrderValidation.tokenSchema, true),
		auth(orderEndPoint.update),
		validation(OrderValidation.updateOrderSchema),
		orderController.updateOrder,
	)
	.delete(
		"/cancel/:id",
		validation(OrderValidation.tokenSchema, true),
		auth(orderEndPoint.delete),
		validation(OrderValidation.deleteOrderSchema),
		orderController.deleteOrder,
	)
	.get(
		"/Orders",
		validation(OrderValidation.tokenSchema, true),
		auth(orderEndPoint.get),
		orderController.getAllOrders,
	)
	.get(
		"/OrderDetails/:id",
		validation(OrderValidation.tokenSchema, true),
		auth(orderEndPoint.get),
		validation(OrderValidation.getAllOrderSchema),
		orderController.getOrderDetails,
	);
export default router;
