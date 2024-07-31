import eventModel from "../../../../DB/models/Event.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";
export const CreateNewEvent = asyncHandler(async (req, res, next) => {
	// Check if an event with the same title, date, and location already exists
	const existingEvent = await eventModel.findOne({ title: req.body.title });

	if (existingEvent) {
		return res.status(400).json({ message: "Event already exists" });
	}
	// Create a new event using the provided details
	const event = await eventModel.create(req.body);
	// Respond with the created event and a success message
	return res.status(201).json({ message: "Event created successfully", event });
});
//get all event
export const getAllEvents = asyncHandler(async (req, res, next) => {
	const events = await eventModel.find();
	return res.status(200).json({ message: "Events", events });
});
// get oneEvent
export const getEventDetails = asyncHandler(async (req, res, next) => {
	const event = await eventModel.findById(req.params.id);
	if (!event) {
		return res.status(404).json({ message: "Event not found" });
	}
	return res.status(200).json({ message: "Events", event });
});
//update event
export const updateEventDetails = asyncHandler(async (req, res, next) => {
	const updateEvent = await eventModel.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
	);
	if (!updateEvent) {
		return res.status(404).json({ message: "Event not found" });
	}
	return res.status(200).json({ message: "Event updated successfully", updateEvent });
});
//delete event
export const deleteEvent = asyncHandler(async (req, res) => {
    const event = await eventModel.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  });
