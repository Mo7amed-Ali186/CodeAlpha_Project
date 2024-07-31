import { roles } from "../../middleware/auth.js";

const eventEndPoint = {
	create: [roles.HR],
	update: [roles.HR],
	delete: [roles.HR],
};
export default eventEndPoint;
