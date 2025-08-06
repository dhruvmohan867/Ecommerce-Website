import axios from "axios";

const API = axios.create({
  baseURL: "https://ecommerce-website-6qhx.onrender.com/api/",
});

export const UserSignUp = async (data) => await API.post("/user/signup", data);
export const UserSignIn = async (data) => await API.post("/user/signin", data);

//Products
export const getAllProducts = async (filter) =>
  await API.get(`/products?${filter}`);

export const getProductDetails = async (id) => await API.get(`/products/${id}`);

//Cart

export const getCart = async (token) =>
  await API.get("/user/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToCart = async (token, data) =>
  await API.post(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFromCart = async (token, data) =>
  await API.delete(`/user/cart/`, {
    headers: { Authorization: `Bearer ${token}` },
    data: data, // Attach the body here
  });

//Favourites

export const getFavorite = async (token) =>
  await API.get(`/user/favorite`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToFavorite = async (token, data) =>
  await API.post(`/user/favorite/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFromFavorite = async (token, data) =>
  await API.delete(`/user/favorite/`, {
    headers: { Authorization: `Bearer ${token}` },
    data: data,
  });

//Orders

export const placeOrder = async (token, data) =>
  await API.post(`/user/orders/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getOrders = async (token) =>
  await API.get(`/user/orders/`, {
    headers: { Authorization: `Bearer ${token}` },
  });