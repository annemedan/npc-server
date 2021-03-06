const router = require("express").Router();
const Cart = require("../models/cart.model");
const Item = require("../models/item.model");
const User = require("../models/user.model");

router.get("/cart", async (req, res) => {
  try {
    console.log("request", req.payload);
    const cart = await Cart.find();
    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/cart/:id", async (req, res) => {
  try {
    const { itemId, quantity, purchasePrice, userId } = req.body;
    const user = await User.findById(userId);
    const item = await Item.findById(itemId);
    //console.log("user", user);
    //console.log("item", item);
    if (!itemId) {
      res.status(400).message({ message: "missing fields" });
      return;
    }

    let response;
    let updatedUser = {};
    if (user.cart) {
      await Cart.findByIdAndUpdate(
        user.cart._id,
        { $push: { products: { item, quantity, purchasePrice } } },
        { new: true } //<= responding with new (updated) object
      );
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
        userId,
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

router.put("/cart/:id", async (req, res) => {
  try {
    const { itemId, quantity, purchasePrice, userId } = req.body;
    const user = await User.findById(userId);
    const item = await Item.findById(itemId);
    //console.log("user with cart", user);
    //console.log("item", item);
    if (!itemId) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    await Cart.findByIdAndUpdate(
      user.cart._id,
      { $push: { products: { item, quantity, purchasePrice } } },
      { new: true } //<= responding with new (updated) object
    );

    res.status(200).json(user);
  } catch (e) {
    console.log("error", e);
    res.status(500).json({ message: e.message });
  }
});

//this new routes are now working

router.put("/cart/:id/increase", async (req, res) => {
  try {
    const { itemId, quantity, purchasePrice, userId } = req.body;
    const user = await User.findById(userId).populate("cart");

    const item = await Item.findById(itemId);

    if (!itemId) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    const cart = await Cart.findById(user.cart._id).populate("products.item");
    const product = cart.products.find(
      (product) => product.item.name === item.name
    );
    product.quantity++;

    const newCart = await Cart.findByIdAndUpdate(
      user.cart._id,
      {
        products: cart.products,
      },
      { new: true }
    ).populate("products.item");

    res.status(200).json(newCart);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/cart/:id/decrease", async (req, res) => {
  try {
    const { itemId, quantity, purchasePrice, userId } = req.body;
    const user = await User.findById(userId).populate("cart");

    const item = await Item.findById(itemId);

    if (!itemId) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    const cart = await Cart.findById(user.cart._id).populate("products.item");

    const product = cart.products.find(
      (product) => product.item.name === item.name
    );
    product.quantity--;

    const newCart = await Cart.findByIdAndUpdate(
      user.cart._id,
      {
        products: cart.products,
      },
      { new: true }
    ).populate("products.item");

    res.status(200).json(newCart);
  } catch (e) {
    console.log("error", e);
    res.status(500).json({ message: e.message });
  }
});

router.put("/cart/:id/remove", async (req, res) => {
  try {
    const { itemId, quantity, purchasePrice, userId } = req.body;
    const user = await User.findById(userId).populate("cart");

    const item = await Item.findById(itemId);
    if (!itemId) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const cart = await Cart.findById(user.cart._id).populate("products.item");

    const products = cart.products.filter(
      (product) => product.item.name !== item.name
    );

    const newCart = await Cart.findByIdAndUpdate(
      user.cart._id,
      {
        products: products,
      },
      { new: true }
    ).populate("products.item");

    res.status(200).json(newCart);
  } catch (e) {
    console.log("error", e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
