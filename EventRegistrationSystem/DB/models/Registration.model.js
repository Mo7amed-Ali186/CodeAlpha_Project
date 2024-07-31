import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		registeredAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
	},
);

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;
