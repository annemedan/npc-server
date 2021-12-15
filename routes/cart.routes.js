const router = require("express").Router();
const Cart = require("../models/cart.model");
const Item = require("../models/item.model");
const User = require("../models/user.model");

router.get("/cart", async (req, res) => {
  try {
    console.log("request", req.session.currentUser);
    const cart = await Cart.find();
    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const { itemId, quantity, purchasePrice } = req.body;
    const user = await User.findById(req.user._id);
    const item = await Item.findById(itemId);
    console.log("user", user);
    console.log("item", item);
    if (!itemId) {
      res.status(400).message({ message: "missing fields" });
      return;
    }

    let response;
    let updatedUser = {};
    if (user.cart) {
    } else {
      response = await Cart.create({
        products: [
          {
            item,
            quantity,
            purchasePrice,
          },
        ],
      });

      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          cart: response,
        },
        { new: true }
      );
    }

    res.status(200).json(updatedUser);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
