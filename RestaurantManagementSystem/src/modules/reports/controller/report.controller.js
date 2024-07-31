import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { asyncHandler } from '../../../utils/errorHandler.js';
import Order from '../../../../DB/models/Order.model.js';
import Inventory from '../../../../DB/models/Inventory.model.js';
import Reservation from '../../../../DB/models/Reservation.model.js';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path for the main reports folder
const REPORT_FOLDER = path.join(__dirname, '../../../../Report');

// Create the reports folder if it doesn't exist
if (!fs.existsSync(REPORT_FOLDER)) {
  fs.mkdirSync(REPORT_FOLDER);
}

// Helper function to get the date filter based on provided start and end dates
const getDateFilter = (startDate, endDate) => {
  const filter = {};
  if (startDate) {
    filter.$gte = new Date(startDate);
  }
  if (endDate) {
    filter.$lte = new Date(endDate);
  }
  return filter;
};

// Helper function to write the workbook to a file with retries
const writeFileWithRetries = async (workbook, filePath, retries = 3) => {
  while (retries > 0) {
    try {
      await workbook.xlsx.writeFile(filePath);
      return;
    } catch (error) {
      if (error.code === 'EBUSY' && retries > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        retries--;
      } else {
        throw error;
      }
    }
  }
};

// Helper function to create a subfolder within the report folder
const ensureSubFolderExists = (subFolderName) => {
  const subFolderPath = path.join(REPORT_FOLDER, subFolderName);
  if (!fs.existsSync(subFolderPath)) {
    fs.mkdirSync(subFolderPath);
  }
  return subFolderPath;
};

// Generate Sales Report
export const generateSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;
  const dateFilter = getDateFilter(startDate, endDate);

  // Find orders within the specified date range
  const orders = await Order.find({
    ...(startDate || endDate ? { createdAt: dateFilter } : {})
  }).populate('items.menuItem').populate('user').populate('table');

  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  // Define columns for the worksheet
  worksheet.columns = [
    { header: 'Order ID', key: 'id', width: 30 },
    { header: 'User', key: 'user', width: 30 },
    { header: 'Table', key: 'table', width: 15 },
    { header: 'Items', key: 'items', width: 50 },
    { header: 'Total Price', key: 'totalPrice', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Created At', key: 'createdAt', width: 30 }
  ];

  // Add rows to the worksheet based on the orders
  orders.forEach(order => {
    worksheet.addRow({
      id: order._id,
      user: order.user.username,
      table: order.table ? order.table.number : 'N/A',
      items: order.items.map(i => `${i.menuItem.name} (${i.quantity})`).join(', '),
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt
    });
  });

  // Ensure the subfolder for sales reports exists
  const salesReportFolder = ensureSubFolderExists('Sales');
  const filePath = path.join(salesReportFolder, `Sales_Report_${startDate || 'all'}_to_${endDate || 'all'}.xlsx`);
  await writeFileWithRetries(workbook, filePath);

  return res.status(200).json({ message: 'Sales report generated successfully', filePath });
});

// Generate Inventory Report
export const generateInventoryReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;
  const dateFilter = getDateFilter(startDate, endDate);

  // Find inventories within the specified date range
  const inventories = await Inventory.find({
    ...(startDate || endDate ? { updatedAt: dateFilter } : {})
  });

  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inventory Report');

  // Define columns for the worksheet
  worksheet.columns = [
    { header: 'Item ID', key: 'id', width: 30 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Quantity', key: 'quantity', width: 15 },
    { header: 'Unit', key: 'unit', width: 15 },
    { header: 'Last Updated', key: 'updatedAt', width: 30 }
  ];

  // Add rows to the worksheet based on the inventories
  inventories.forEach(inventory => {
    worksheet.addRow({
      id: inventory._id,
      name: inventory.name,
      quantity: inventory.quantity,
      unit: inventory.unit,
      updatedAt: inventory.updatedAt
    });
  });

  // Ensure the subfolder for inventory reports exists
  const inventoryReportFolder = ensureSubFolderExists('Inventory');
  const filePath = path.join(inventoryReportFolder, `Inventory_Report_${startDate || 'all'}_to_${endDate || 'all'}.xlsx`);
  await writeFileWithRetries(workbook, filePath);

  return res.status(200).json({ message: 'Inventory report generated successfully', filePath });
});

// Generate Reservation Report
export const generateReservationReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;
  const dateFilter = getDateFilter(startDate, endDate);

  // Find reservations within the specified date range
  const reservations = await Reservation.find({
    ...(startDate || endDate ? { createdAt: dateFilter } : {})
  }).populate('user').populate('table');

  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reservation Report');

  // Define columns for the worksheet
  worksheet.columns = [
    { header: 'Reservation ID', key: 'id', width: 30 },
    { header: 'User', key: 'user', width: 30 },
    { header: 'Table', key: 'table', width: 15 },
    { header: 'Start Time', key: 'startTime', width: 30 },
    { header: 'End Time', key: 'endTime', width: 30 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Created At', key: 'createdAt', width: 30 }
  ];

  // Add rows to the worksheet based on the reservations
  reservations.forEach(reservation => {
    worksheet.addRow({
      id: reservation._id,
      user: reservation.user.username,
      table: reservation.table ? reservation.table.number : 'N/A',
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      status: reservation.status,
      createdAt: reservation.createdAt
    });
  });

  // Ensure the subfolder for reservation reports exists
  const reservationReportFolder = ensureSubFolderExists('Reservation');
  const filePath = path.join(reservationReportFolder, `Reservation_Report_${startDate || 'all'}_to_${endDate || 'all'}.xlsx`);
  await writeFileWithRetries(workbook, filePath);

  return res.status(200).json({ message: 'Reservation report generated successfully', filePath });
});
