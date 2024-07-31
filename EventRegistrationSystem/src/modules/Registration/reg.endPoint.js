import { roles } from "../../middleware/auth.js";

const registerEndPoint = {
	create: [roles.User],
	update: [roles.User],
	delete: [roles.User],
get:[roles.User,roles.HR],

};
export default registerEndPoint;