import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		date: { type: Date, required: true },
		location: { type: String, required: true },
		isDeleted: {
			type: Boolean,
			default: false,
		}
	},
	{
		timestamps: true,
	},
);
const eventModel = mongoose.model("Event", eventSchema);
export default eventModel;
