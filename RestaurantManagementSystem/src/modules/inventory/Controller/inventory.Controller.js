import InventoryItem from "../../../../DB/models/Inventory.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";

export const createNewInventoryItem = asyncHandler(async (req, res, next) => {
        const existingInventoryItem = await InventoryItem.findOne({ name: req.body.name });

        if (existingInventoryItem) {
            return next(new Error("Inventory item already exists", { cause: 400 }));

        }
        const inventoryItem = await InventoryItem.create(req.body);
        return res.status(201).json({ message: "Inventory item created successfully", inventoryItem });
        
    });

// Get All Inventory Items
export const getAllInventoryItems = asyncHandler(async (req, res, next) => {
    const inventoryItems = await InventoryItem.find();
    return res.status(200).json({ message: "Inventory items", inventoryItems });
});

// Get Inventory Item Details by ID
export const getInventoryItemDetails = asyncHandler(async (req, res, next) => {
    const inventoryItem = await InventoryItem.findById(req.params.id);
    if (!inventoryItem) {
        return next(new Error("Inventory item not found", { cause: 404 }));

    }
    return res.status(200).json({ message: "Inventory item", inventoryItem });
});

// Update Inventory Item Details
export const updateInventoryItemDetails = asyncHandler(async (req, res, next) => {
        const updatedInventoryItem = await InventoryItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedInventoryItem) {
            return next(new Error("Inventory item not found", { cause: 404 }));

        }
        return res.status(200).json({ message: "Inventory item updated successfully", updatedInventoryItem });
    })
;

// Delete Inventory Item
export const deleteInventoryItem = asyncHandler(async (req, res) => {
        const inventoryItem = await InventoryItem.findByIdAndDelete(req.params.id);
        if (!inventoryItem) {
            return next(new Error("Inventory item not found", { cause: 404 }));

        }
        return res.status(200).json({ message: "Inventory item deleted successfully" });
    })
;