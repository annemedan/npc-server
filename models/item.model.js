const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String },
  category: {
    type: String,
    enum: [
      "Food",
      "Homeware",
      "Handicraft",
      "Beverages",
      "Desserts",
      "Vintage",
      "Other",
    ],
  },
  productImage: { type: String },
  quantity_available: { type: Number },
  price: { type: Number, trim: true, required: true, maxlength: 10 },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
