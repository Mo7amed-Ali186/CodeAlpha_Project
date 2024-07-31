import { globalError } from "./utils/errorHandler.js";
import { connection } from "../DB/connection.js";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/User/user.routes.js";
import eventRouter from "./modules/event/event.routes.js";
import registerRouter from "./modules/Registration/reg.routes.js";

export function bootstrap(app, express) {
	connection();
	app.use(express.json());
	app.use("/uploads", express.static("uploads"));
	app.use("/event", eventRouter);
	app.use("/register", registerRouter);
	app.use("/auth", authRouter);
	app.use("/user", userRouter);
	app.use("*", (req, res, next) => {
		return res.json({ message: "Invalid Request" });
	});
	app.use(globalError);
}
