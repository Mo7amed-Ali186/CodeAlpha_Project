import { compare } from "bcrypt";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";
import {
	generateToken,
	verifyToken,
} from "../../../utils/generateAndVerifyToken.js";
import {
	comparePassword,
	hashPassword,
} from "../../../utils/hashAndCompare.js";

/* create signup contain 
gain data ,
check if email exist ,
hash password 
create user*/

export const signUp = asyncHandler(async (req, res, next) => {
	const { email, mobileNumber } = req.body;
	// Check if email already exists
	const emailExists = await userModel.findOne({
		$or: [{ email }, { mobileNumber }],
		isDeleted: false,
	});
	if (emailExists) {
		return next(
			new Error("Email or mobileNumber already exists ", { cause: 409 }),
		);
	}
	// Hash password
	req.body.password = hashPassword({ plaintext: req.body.password });
	const newUser = await userModel.create(req.body);
	return res.status(201).json({ message: "Done", user: newUser });
});
/*
-get emailOrMobileNumber and password
-check if emailOrMobileNumber exist
-compare password
-generate token and refresh token
-update status of user
*/
export const logIn = asyncHandler(async (req, res, next) => {
	const { emailOrMobileNumber, password } = req.body;

	// Check if the user exists with the provided email or mobile number
	const user = await userModel.findOne({
		$or: [
			{ email: emailOrMobileNumber },
			{ mobileNumber: emailOrMobileNumber },
		],
		isDeleted: false,
	});

	if (!user) {
		return next(
			new Error("Invalid email/mobile number or password or Deleted", {
				cause: 400,
			}),
		);
	}
	// Check if the provided password is valid
	if (!comparePassword({ plaintext: password, hashValue: user.password })) {
		return next(
			new Error("Invalid email/mobile number or password", { cause: 400 }),
		);
	}
	// Generate tokens for authentication
	const token = generateToken({
		payload: { email: user.email, id: user._id },
		signature: process.env.TOKEN_SIGNATURE,
		expiresIn: 60 * 30,
	});
	const rfToken = generateToken({
		payload: { email: user.email, id: user._id },
		signature: process.env.TOKEN_SIGNATURE,
		expiresIn: 60 * 60 * 24 * 30,
	});
	// Update user status to "Online"
	await userModel.updateMany(
		{ email: user.email },
		{ status: "Online" },
		{ new: true },
	);
	return res.json({ message: "Sign In successful", token, rfToken });
});
