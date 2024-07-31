import Order from '../../../../DB/models/Order.model.js';
import Table from '../../../../DB/models/Table.model.js';
import MenuItem from '../../../../DB/models/MenuItem.model.js';
import Reservation from '../../../../DB/models/Reservation.model.js';
import { asyncHandler } from '../../../utils/errorHandler.js';

// Create Order
export const createOrder = asyncHandler(async (req, res,next) => {
  const { reservation, items } = req.body;
  const user = req.user._id; // Extract user from the token

  if (!reservation || !items || items.length === 0) {
    return next(new Error("Reservation and items are required", { cause: 400 }));

  }

  // Find the reservation
  const existingReservation = await Reservation.findById(reservation).populate('table');
  if (!existingReservation) {
    return next(new Error("Reservation not found", { cause: 404 }));

  }

  // Calculate the total price
  let totalPrice = 0;
  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItem);
    if (!menuItem) {
      return next(new Error(`Menu item with ID ${item.menuItem} not found`, { cause: 404 }));
    }
    totalPrice += menuItem.price * item.quantity;
  }

  // Create a new order
  const order = await Order.create({
    reservation,
    table: existingReservation.table._id,
    items,
    totalPrice,
    user,
    status: 'Pending'
  });

  // Update the table's status to 'Occupied'
  const table = existingReservation.table;
  table.status = 'Occupied';
  table.orders.push(order._id); // Add the new order to the table's orders array
  await table.save();

  // Update the reservation's order field
  existingReservation.order = order._id; // Link the reservation to the new order
  await existingReservation.save();

  return res.status(201).json({ message: 'Order created successfully', order });
});



// Get All Orders
export const getAllOrders = asyncHandler(async (req, res,next) => {
  const orders = await Order.find()
    .populate({
      path:'table',
      select: '_id'
    })  // Populate the table field
    .populate({
      path: 'items.menuItem',  // Populate menuItem inside items
      select: 'name price'     // Specify fields to select (if needed)
    })
    .populate({
      path:'reservation',
      select: '_id'
    }); // Populate the reservation field

  return res.status(200).json({ message: 'Orders', orders });
});

export const getOrderDetails = asyncHandler(async (req, res,next) => {
  // Extract the user from the token
  const userId = req.user._id;

  // Find the order and populate relevant fields
  const order = await Order.findById(req.params.id)
    .populate('table')
    .populate('items.menuItem')
    .populate('reservation');

  // Check if the order exists
  if (!order) {
    return next(new Error("Order not found", { cause: 404 }));
  }

  // Check if the user making the request is the same as the one who created the order
  if (order.user.toString() !== userId.toString()) {
    return next(new Error("Unauthorized access", { cause: 403 }));

  }

  // Return order details if the user is authorized
  return res.status(200).json({ message: 'Order details', order });
});


export const updateOrder = asyncHandler(async (req, res,next) => {
  const { items, status, reservation } = req.body;
  const userId = req.user._id; // Extract user from the token

  // Find the order and populate relevant fields
  const order = await Order.findById(req.params.id)
  .populate({
    path:'table',
    select: '_id'
  })
    .populate({
      path:'reservation',
      select: '_id'
    });

  // Check if the order exists
  if (!order) {
    return next(new Error("Order not found", { cause: 404 }));

  }

  // Check if the user making the request is the same as the one who created the order
  if (order.user.toString() !== userId.toString()) {
    return next(new Error("Unauthorized access", { cause: 403 }));

  }

  // Update items and calculate total price
  if (items) {
    let totalPrice = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return next(new Error(`Menu item with ID ${item.menuItem} not found`, { cause: 404 }));

      }
      totalPrice += menuItem.price * item.quantity;
    }

    order.totalPrice = totalPrice;
    order.items = items;
  }

  // Update order status and handle table status if applicable
  if (status) {
    order.status = status;

    if (order.table) {
      if (status === 'Completed' || status === 'Cancelled') {
        order.table.status = 'Available';
        await order.table.save();
      }
    }
  }

  // Update reservation if provided
  if (reservation) {
    const existingReservation = await Reservation.findById(reservation);
    if (!existingReservation) {
      return next(new Error("Reservation not found", { cause: 404 }));

    }

    order.reservation = reservation;
    existingReservation.order = order._id;
    await existingReservation.save();
  }

  // Save the updated order
  const updatedOrder = await order.save();
  return res.status(200).json({ message: 'Order updated successfully', updatedOrder });
});



export const deleteOrder = asyncHandler(async (req, res,next) => {
  const userId = req.user._id; // Extract user from the token

  // Find the order and populate relevant fields
  const order = await Order.findById(req.params.id).populate('table').populate('reservation');

  // Check if the order exists
  if (!order) {
    return next(new Error("Order not found", { cause: 404 }));

  }

  // Check if the user making the request is the same as the one who created the order
  if (order.user.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'Unauthorized access' });
    return next(new Error("Unauthorized access", { cause: 403 }));

  }

  // Set order status to 'Cancelled'
  order.status = 'Cancelled';

  // Update table status to 'Available' if the order is linked to a table
  if (order.table) {
    const table = await Table.findById(order.table._id); // Fetch the table document
    if (table) {
      table.status = 'Available';
      await table.save(); // Save the updated table document
    }
  }

  // Clear the reservation's order field if applicable
  if (order.reservation) {
    const reservation = await Reservation.findById(order.reservation);
    if (reservation) {
      reservation.order = null;
      await reservation.save();
    }
  }

  // Save the updated order
  await order.save();

  return res.status(200).json({ message: 'Order cancelled successfully' });
});
