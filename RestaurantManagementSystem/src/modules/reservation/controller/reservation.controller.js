import Reservation from "../../../../DB/models/Reservation.model.js";
import Table from "../../../../DB/models/Table.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";

// Create Reservation
export const createReservation = asyncHandler(async (req, res) => {
	const { table, startTime, endTime } = req.body;
	const user = req.user._id; // Extract user from the token

	if (!table || !startTime || !endTime) {
		return res
			.status(400)
			.json({ message: "Table, startTime, and endTime are required" });
	}

	// Check if the table is available during the specified time
	const conflictingReservations = await Reservation.find({
		table,
		$or: [
			{ startTime: { $lt: endTime, $gte: startTime } },
			{ endTime: { $gt: startTime, $lte: endTime } },
			{ startTime: { $lte: startTime }, endTime: { $gte: endTime } },
		],
	});

	if (conflictingReservations.length > 0) {
		return res
			.status(400)
			.json({ message: "Table is already reserved for the specified time" });
	}

	// Create the reservation
	const reservation = await Reservation.create({
		table,
		user,
		startTime,
		endTime,
	});

	// Update the table's status and add the reservation to the table
	const updatedTable = await Table.findByIdAndUpdate(
		table,
		{
			$set: { status: "Occupied" },
			$push: { reservations: reservation._id },
		},
		{ new: true },
	);

	if (!updatedTable) {
		return res.status(404).json({ message: "Table not found" });
	}

	return res
		.status(201)
		.json({ message: "Reservation created successfully", reservation });
});

// Get All Reservations
export const getAllReservations = asyncHandler(async (req, res) => {
	const reservations = await Reservation.find()
		.populate({
			path: "table",
			select: "_id number capacity",
		})
		.populate({
			path: "user",
			select: "username mobileNumber email",
		});
	return res.status(200).json({ message: "Reservations", reservations });
});

// Get Reservation Details by ID
export const getReservationDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract user from the token

  const reservation = await Reservation.findById(req.params.id)
    .populate({
      path: "table",
      select: "_id number capacity",
    })
    .populate({
      path: "user",
      select: "username mobileNumber email",
    });

  if (!reservation) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  // Check if the user making the request is the same as the one associated with the reservation
  if (reservation.user._id.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  return res.status(200).json({ message: "Reservation details", reservation });
});


// Update Reservation
export const updateReservation = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract user from the token
  const { startTime, endTime, status } = req.body;

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  // Check if the user making the request is the same as the one associated with the reservation
  if (reservation.user.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  if (startTime) reservation.startTime = startTime;
  if (endTime) reservation.endTime = endTime;
  if (status) reservation.status = status;

  const updatedReservation = await reservation.save();
  return res
    .status(200)
    .json({ message: "Reservation updated successfully", updatedReservation });
});


// Delete Reservation
export const deleteReservation = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract user from the token

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  // Check if the user making the request is the same as the one associated with the reservation
  if (reservation.user.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  // Delete the reservation
  await Reservation.findByIdAndDelete(req.params.id);

  // Update the table's status to 'Available' when the reservation is deleted
  const table = await Table.findByIdAndUpdate(
    reservation.table,
    { $set: { status: "Available" }, $pull: { reservations: reservation._id } },
    { new: true }
  );

  if (!table) {
    return res.status(404).json({ message: "Table not found" });
  }

  return res.status(200).json({ message: "Reservation deleted successfully" });
});
