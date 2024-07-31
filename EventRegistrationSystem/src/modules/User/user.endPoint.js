import { roles } from "../../middleware/auth.js";

const userEndPoint = {
	create: [roles.HR,roles.User],
	update: [roles.HR,roles.User],
	delete: [roles.HR,roles.User],
};
export default userEndPoint;
