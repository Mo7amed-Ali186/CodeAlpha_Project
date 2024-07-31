import { roles } from "../../middleware/auth.js";

const inventoryEndPoint = {
	create: [roles.Admin],
	update: [roles.Admin],
	delete: [roles.Admin],
get:[roles.User,roles.Admin],

};
export default inventoryEndPoint;