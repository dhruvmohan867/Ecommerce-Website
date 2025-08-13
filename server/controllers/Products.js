import mongoose from "mongoose";
import Product from "../models/Products.js";
import { createError } from "../error.js";
import Orders from "../models/Orders.js";

export const addProducts = async (req, res, next) => {
  try {
    const productsData = req.body;

    if (!Array.isArray(productsData)) {
      return next(
        createError(400, "Invalid request. Expected an array of products")
      );
    }

    const createdproducts = [];

    for (const productInfo of productsData) {
      const { title, name, desc, img, price, sizes, category } = productInfo;

      const product = new Product({
        title,
        name,
        desc,
        img,
        price,
        sizes,
        category,
      });
      const createdproduct = await product.save();

      createdproducts.push(createdproduct);
    }

    return res
      .status(201)
      .json({ message: "Products added successfully", createdproducts });
  } catch (err) {
    next(err);
  }
};
export const getAllOrders = async (req, res, next) => {
  try {
    // It's better if you sort by most recent
    const orders = await Orders.find({ user: req.user.id })
      .populate("products.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
export const getproducts = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, sizes, search, page = 1, limit = 12 } = req.query;
    sizes = sizes?.split(",");
    categories = categories?.split(",");
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    if (categories && Array.isArray(categories) && categories[0]) {
      filter.category = { $in: categories };
    }

    if (minPrice || maxPrice) {
      filter["price.org"] = {};
      if (minPrice) filter["price.org"]["$gte"] = parseFloat(minPrice);
      if (maxPrice) filter["price.org"]["$lte"] = parseFloat(maxPrice);
    }

    if (sizes && Array.isArray(sizes) && sizes[0]) {
      filter.sizes = { $in: sizes };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, "i") } },
        { desc: { $regex: new RegExp(search, "i") } },
      ];
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid product ID"));
    }
    const product = await Product.findById(id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};
