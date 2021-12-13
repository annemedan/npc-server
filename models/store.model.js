//! not sure if i'll need this one

const { Schema, model } = require("mongoose");

const storeSchema = new Schema({
  name: { type: String, required: true },

  bio: { type: String },

  city: { type: String, required: true },

  logo: { type: String },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Store = model("Store", storeSchema);

module.exports = Store;
