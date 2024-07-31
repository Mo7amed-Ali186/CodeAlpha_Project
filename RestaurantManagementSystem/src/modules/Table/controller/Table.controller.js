import Table from '../../../../DB/models/Table.model.js';
import { asyncHandler } from '../../../utils/errorHandler.js';

// Create Table
export const createTable = asyncHandler(async (req, res) => {
  const { number, capacity } = req.body;

  // Validate the presence of the number field
  if (!number) {
    return res.status(400).json({ message: 'Table number is required' });
  }

  // Check if table number already exists
  const existingTable = await Table.findOne({ number });
  if (existingTable) {
    return res.status(400).json({ message: 'Table number already exists' });
  }

  const table = await Table.create({ number, capacity });
  return res.status(201).json({ message: 'Table created successfully', table });
});

// Get All Tables
export const getAllTables = asyncHandler(async (req, res) => {
  const tables = await Table.find().populate('orders').populate('reservations');
  return res.status(200).json({ message: 'Tables', tables });
});

// Get Table Details by ID
export const getTableDetails = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id).populate('orders').populate('reservations');
  if (!table) {
    return res.status(404).json({ message: 'Table not found' });
  }
  return res.status(200).json({ message: 'Table details', table });
});

// Update Table
export const updateTable = asyncHandler(async (req, res) => {
  const { number, capacity, status } = req.body;
  const table = await Table.findById(req.params.id);

  if (!table) {
    return res.status(404).json({ message: 'Table not found' });
  }

  if (number) table.number = number;
  if (capacity) table.capacity = capacity;
  if (status) table.status = status;

  const updatedTable = await table.save();
  return res.status(200).json({ message: 'Table updated successfully', updatedTable });
});

// Delete Table
export const deleteTable = asyncHandler(async (req, res) => {
  const table = await Table.findByIdAndDelete(req.params.id);
  if (!table) {
    return res.status(404).json({ message: 'Table not found' });
  }
  return res.status(200).json({ message: 'Table deleted successfully' });
});
