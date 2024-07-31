import MenuItem from "../../../../DB/models/MenuItem.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";

export const createNewMenuItem = asyncHandler(async (req, res, next) => {
    // Check if a menu item with the same name already exists
    const existingMenuItem = await MenuItem.findOne({ name: req.body.name });

    if (existingMenuItem) {
        return res.status(400).json({ message: "Menu item already exists" });
    }
    // Create a new menu item using the provided details
    const menuItem = await MenuItem.create(req.body);
    // Respond with the created menu item and a success message
    return res.status(201).json({ message: "Menu item created successfully", menuItem });
});

//Get All MenuItems
export const getAllMenuItems = asyncHandler(async (req, res, next) => {
    const menuItems = await MenuItem.find();
    return res.status(200).json({ message: "Menu items", menuItems });
});

//Get MenuItem Details by ID
export const getMenuItemDetails = asyncHandler(async (req, res, next) => {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
    }
    return res.status(200).json({ message: "Menu item", menuItem });
});

//Update MenuItem Details
export const updateMenuItemDetails = asyncHandler(async (req, res, next) => {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!updatedMenuItem) {
        return res.status(404).json({ message: "Menu item not found" });
    }
    return res.status(200).json({ message: "Menu item updated successfully", updatedMenuItem });
});

//Delete MenuItem
export const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
    }
    return res.status(200).json({ message: "Menu item deleted successfully" });
});
