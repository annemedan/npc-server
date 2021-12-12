//not sure if i'll need this one

const { Schema, model } = require("mongoose");

const storeSchema = new Schema({
  name: { type: String, required: true },

  bio: { type: String },

  city: { type: String, required: true },

  logo: { type: String },

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],

  // status: { type: String, default: "Waiting Approval", enum: ["Waiting Approval", "Rejected", "Approved"] },
});

const Store = model("Store", storeSchema);

module.exports = Store;
