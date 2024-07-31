import { roles } from "../../middleware/auth.js";

const orderEndPoint = {
	create: [roles.User],
	update: [roles.User],
	delete: [roles.User],
    get:[roles.User,roles.Admin],

};
export default orderEndPoint;