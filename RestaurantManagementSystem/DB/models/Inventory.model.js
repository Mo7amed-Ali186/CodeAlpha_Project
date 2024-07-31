import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  supplier: {
    type: String,
    required: false,
  },
  expirationDate: {
    type: Date,
    required: false,
  },
},{
    timestamps: true,
},);

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem;
