import { roles } from "../../middleware/auth.js";

const reportEndPoint = {

    get:[roles.Admin],

};
export default reportEndPoint;