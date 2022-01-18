const router = require("express").Router();
const Item = require("../models/item.model");
const User = require("../models/user.model");

router.get("/products", async (req, res) => {
  const search = req.query.query ? req.query.query : "";
  const limit = req.query.limit ? Number(req.query.limit) : 0;
  const stock = req.query.stock === "true" ? 1 : 0;
  const category = req.query.category;
  try {
    let items = [];

    if (category) {
      if (search) {
        items = await Item.find({
          name: { $regex: `${search}`, $options: "i" },
          quantity_available: { $gte: stock },
          category: category,
        })
          .limit(limit)
          .populate(["user"]);
      } else {
        items = await Item.find({ category: category })
          .limit(limit)
          .populate(["user"]);
      }
    } else {
      if (search) {
        items = await Item.find({
          name: { $regex: `${search}`, $options: "i" },
          quantity_available: { $gte: stock },
        })
          .limit(limit)
          .populate(["user"]);
      } else {
        items = await Item.find().limit(limit).populate(["user"]);
      }
    }

    res.status(200).json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// add products

router.post("/products/add", async (req, res) => {
  // /products or /products/add?
  const {
    user,
    name,
    category,
    productImage,
    quantity_available,
    price,
    description,
  } = req.body;

  if (!name || !category || !quantity_available || !price || !description) {
    res.status(400).json({ message: "missing fields" });
    return;
  }

  try {
    const response = await Item.create({
      user,
      name,
      category,
      productImage,
      quantity_available,
      price,
      description,
    });

    await User.findByIdAndUpdate(user, {
      $push: {
        productItems: response,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error creating item:", error);
  }
});

// delete products

router.delete("/products/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: `Item with id ${req.params.id} was deleted.` });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//edit products // edit button as this is also the details page (?) need to see how to do it with the front end

router.get("/products/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user");
    res.status(200).json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/products/:id/edit", async (req, res) => {
  const {
    name,
    category,
    productImage,
    quantity_available,
    price,
    description,
  } = req.body;
  if (!name || !category || !quantity_available || !price || !description) {
    res.status(400).message({ message: "missing fields" });
    return;
  }
  try {
    const response = await Item.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        productImage,
        quantity_available,
        price,
        description,
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//trying to fix the search

router.get("/products/search", async (req, res) => {
  let query = req.query.q;
  console.log("query >>---", query);

  let searchResults;
  if (query) {
    let regex = new RegExp(query, "i", "g");
    searchResults = await Item.find({
      $or: [{ name: regex }, { category: regex }, { description: regex }],
    });
  } else {
    searchResults = [];
  }
  //console.log( "searchResults", searchResults );
  res.status(200).json(items);
});

module.exports = router;
