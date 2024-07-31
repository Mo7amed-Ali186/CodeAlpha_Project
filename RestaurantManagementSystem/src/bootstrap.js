import { globalError } from "./utils/errorHandler.js";
import { connection } from "../DB/connection.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/User/user.routes.js";
import menuRouter from "./modules/menuItem/menuItem.routes.js";
import inventoryRouter from "./modules/inventory/inventory.routes.js";
import orderRouter from "./modules/Order/Order.routes.js";
import tableRouter from "./modules/Table/Table.routes.js";
import reservationRouter from "./modules/reservation/reservation.routes.js";
import reportRouter from "./modules/reports/report.routes.js";


export function bootstrap(app, express) {
	connection();
	app.use(express.json());
	app.use("/uploads", express.static("uploads"));
	app.use("/auth", authRouter);
	app.use("/user", userRouter);
	app.use("/menu", menuRouter);
	app.use("/order", orderRouter);
	app.use("/table", tableRouter);
	app.use("/inventory", inventoryRouter);
	app.use("/reservation", reservationRouter);
	app.use("/report", reportRouter);
	app.use("*", (req, res, next) => {
		return res.json({ message: "Invalid Request" });
	});
	app.use(globalError);
}

