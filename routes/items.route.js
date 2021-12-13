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

router.post("/filter-products", async (req, res) => {
  let order = req.body.order ? req.body.order : "name";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";

  const findArgument = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  console.log("findArgs", findArgument);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "category") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Item.find(findArgs)

    .sort([[sortBy, order]])

    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
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

router.put("/products/:id", async (req, res) => {
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

module.exports = router;
