import eventModel from "../../../../DB/models/Event.model.js";
import Registration from "../../../../DB/models/Registration.model.js";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";

export const registerForEvent = asyncHandler(async (req, res, next) => {
	const { eventId } = req.body;
	const { _id } = req.user;

	// Check if the user exists and is not deleted
	const user = await userModel.findOne({ _id, isDeleted: false });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}

	// Check if the event exists and is not deleted
	const event = await eventModel.findOne({ _id: eventId, isDeleted: false });
	if (!event) {
		return next(
			new Error("Event not found or has been deleted", { cause: 404 }),
		);
	}

	// Check if the user is already registered for the event
	const existingRegistration = await Registration.findOne({
		userId: _id,
		eventId,
	});
	if (existingRegistration) {
		return res.status(400).json({ message: "You are already registered for this event" });
	}
	req.body.userId = req.user._id;
	// If event exists, is not deleted, and user is not already registered, create the registration
	const registration = await Registration.create({ userId: _id, eventId });
	return res.status(201).json({ message: "Registered successfully", registration });
});


export const cancelRegistration = asyncHandler(async (req, res, next) => {
    const { eventId } = req.body;
    const { _id } = req.user;
  
    // Check if the user exists and is not deleted
    const user = await userModel.findOne({ _id, isDeleted: false });
    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }
  
    // Check if the event exists and is not deleted
    const event = await eventModel.findOne({ _id: eventId, isDeleted: false });
    if (!event) {
      return next(new Error("Event not found or has been deleted", { cause: 404 }));
    }
  
    // Check if the user is registered for the event
    const existingRegistration = await Registration.findOneAndDelete({ userId: _id, eventId });
    if (!existingRegistration) {
      return res.status(404).json({ message: "You are not registered for this event" });
    }
  
    return res.status(200).json({ message: "Registration cancelled successfully" });
  });

// Get all registrations for a specific user
export const getUserRegistrations = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  // Check if the user exists and is not deleted
  const user = await userModel.findOne({ _id, isDeleted: false });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // Fetch all registrations for the user
  const registrations = await Registration.find({ userId: _id });
  if (!registrations || registrations.length === 0) {
    return res.status(404).json({ message: 'No registrations found for this user' });
  }

  return res.status(200).json({ message: 'User registrations retrieved successfully', registrations });
});

// Get all registrations for a specific event
export const getEventRegistrations = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  // Check if the event exists and is not deleted
  const event = await eventModel.findOne({ _id: eventId, isDeleted: false });
  if (!event) {
    return next(new Error("Event not found or has been deleted", { cause: 404 }));
  }

  // Fetch all registrations for the event
  const registrations = await Registration.find({ eventId });
  if (!registrations || registrations.length === 0) {
    return res.status(404).json({ message: 'No registrations found for this event' });
  }

  return res.status(200).json({ message: 'Event registrations retrieved successfully', registrations });
});
