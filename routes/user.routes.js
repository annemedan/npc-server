const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");

// GET /api/users/current  - Get current user info
router.get("/api/users/profile", isAuthenticated, async (req, res, next) => {
  try {
    // If the user is authenticated we can access the JWT payload via req.payload
    // req.payload holds the user info that was encoded in JWT during login.

    const currentUser = req.payload;

    const user = await User.findById(currentUser._id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/current  - Update the current user
router.put("/api/users/profile", isAuthenticated, async (req, res, next) => {
  try {
    // If the user is authenticated we can access the JWT payload via req.payload
    // req.payload holds the user info that was encoded in JWT during login.

    const currentUser = req.payload;
    const {
      firstName,
      lastName,
      storeName,
      bio,
      phoneNumber,
      address,
      city,
      postCode,
      image,
      email,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      {
        firstName,
        lastName,
        storeName,
        bio,
        phoneNumber,
        address,
        city,
        postCode,
        image,
        email,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// delete /api/users/current  - delete current user info
//!! DELETE ROUTE IS NOT WORKING
// router.post(
//   "/api/users/profile/delete",
//   isAuthenticated,
//   async (req, res, next) => {
//     try {
//       const currentUser = req.payload;
//       const user = await User.findByIdAndDelete(currentUser._id);

//       res.status(200).json(user);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = router;
