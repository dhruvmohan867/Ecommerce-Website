import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";

dotenv.config();

// ✅ REGISTER CONTROLLER
export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createError(409, "Email is already in use"));

    const salt = bcrypt.genSaltSync(10);
    const hashedpassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedpassword,
      img,
    });

    const createduser = await user.save(); // ✅ Await is crucial here!

    const token = jwt.sign({ id: createduser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user: createduser });
  } catch (error) {
    return next(error);
  }
};

// ✅ LOGIN CONTROLLER
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(createError(404, "user not found"));
    }

    const isPasswordCorrect = await bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user: existingUser });
  } catch (error) {
    return next(error);
  }
};

// ✅ ADD TO CART
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);
    const existingCartItemIndex = user.cart.findIndex((item) =>
      item?.product?.equals(productId)
    );
    if (existingCartItemIndex !== -1) {
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();

    return res.status(200).json({ message: "Product added to cart successfully", user });
  } catch (err) {
    next(err);
  }
};

// ✅ REMOVE FROM CART
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Fix: Avoid crash if item.product is undefined
    const productIndex = user.cart.findIndex(
      (item) => item.product && item.product.equals(productId)
    );

    if (productIndex === -1) {
      return next(createError(404, "Product not found in cart"));
    }

    if (quantity && quantity > 0) {
      user.cart[productIndex].quantity -= quantity;

      if (user.cart[productIndex].quantity <= 0) {
        user.cart.splice(productIndex, 1); // Remove item if quantity is 0 or less
      }
    } else {
      // If no quantity is provided, remove item completely
      user.cart.splice(productIndex, 1);
    }

    await user.save();

    return res.status(200).json({
      message: "Product quantity updated in cart",
      cart: user.cart, // better to return just cart
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET ALL CART ITEMS
// ✅ GET ALL CART ITEMS
export const getAllCartItems = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
        path: "cart.product",
        model: "Product",
       })

    if (!user) return next(createError(404, "User not found"));

    res.status(200).json(user.cart);
  } catch (err) {
    console.error("Cart error:", err);
    next(err);
  }
};
// ✅ PLACE ORDER
export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;
    const user = await User.findById(req.user.id);

    const order = new Orders({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
    });
    await order.save();

    user.cart = [];
    await user.save();

    return res.status(200).json({ message: "Order placed successfully", order });
  } catch (err) {
    next(err);
  }
};

// ✅ GET USER ORDERS
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Orders.find({ user: req.user.id });
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

// ✅ ADD TO FAVORITES
export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found"));

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    return res.status(200).json({ message: "Product added to favorites", user });
  } catch (err) {
    next(err);
  }
};

// ✅ REMOVE FROM FAVORITES
export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
    await user.save();

    return res.status(200).json({ message: "Removed from favorites", user });
  } catch (err) {
    next(err);
  }
};

// ✅ GET USER FAVORITES
export const getUserFavourites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favourites").exec();
    if (!user) return next(createError(404, "User not found"));

    return res.status(200).json(user.favourites);
  } catch (err) {
    next(err);
  }
};
