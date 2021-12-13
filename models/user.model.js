const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: Number },
  address: { type: String },
  city: { type: String },
  postCode: { type: String },
  image: {
    type: String,
    default:
      "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
  },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],

  productItems: [{ type: Schema.Types.ObjectId, ref: "Item" }],

  cart: { type: Schema.Types.ObjectId, ref: "Cart" },

  isStore: { type: Boolean, default: false }, // better to use as boolean than as role

  updated: { type: Date },
  created: { type: Date, default: Date.now },
});

module.exports = model("User", userSchema);
