// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const allRoutes = require("./routes");
app.use("/", allRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);

const cartRoutes = require("./routes/cart.routes");
app.use("/", cartRoutes);

const itemsRoutes = require("./routes/items.route");
app.use("/", itemsRoutes);

// const orderRoutes = require("./routes/order.routes");
// app.use("/", orderRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
