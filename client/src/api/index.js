import axios from "axios";
import { useEffect } from "react";

const API = axios.create({
  baseURL: "https://ecommerce-website-6qhx.onrender.com/api/",
  // baseURL: "http://localhost:8080/api", // For local development
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

useEffect(() => {
  getProduct();
}, [getProduct]);

useEffect(() => {
  if (!product) return;
  setFavoriteLoading(true);
  const token = localStorage.getItem("krist-app-token");
  getFavorite(token)
    .then((res) => {
      const isFavorite = res.data?.some(
        (fav) => fav._id === product._id
      );
      setFavorite(isFavorite);
    })
    .catch((err) => {
      dispatch(
        openSnackbar({
          message: err.message,
          severity: "error",
        })
      );
    })
    .finally(() => setFavoriteLoading(false));
}, [product, dispatch]);

useEffect(() => {
  (async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("krist-app-token");
      const data = await getOrders(token);
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  })();
}, []);

useEffect(() => {
  checkFavourite();
}, [checkFavourite]);