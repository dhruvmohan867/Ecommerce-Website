import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Rating } from "@mui/material";
import styled from "styled-components";
import {
  AddShoppingCartOutlined,
  FavoriteBorder,
  FavoriteRounded,
} from "@mui/icons-material";
import {
  addToCart,
  addToFavorite,
  deleteFromFavorite,
  getFavorite,
} from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";

const Card = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease-out;
  cursor: pointer;
  @media (max-width: 600px) {
    width: 170px;
  }
`;
const Image = styled.img`
  width: 100%;
  height: 320px;
  border-radius: 6px;
  object-fit: cover;
  transition: all 0.3s ease-out;
  @media (max-width: 600px) {
    height: 240px;
  }
`;
const Menu = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  top: 14px;
  right: 14px;
  display: none;
  flex-direction: column;
  gap: 12px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 6px;
  transition: all 0.3s ease-out;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
  }

  &:hover ${Image} {
    opacity: 0.9;
  }
  &:hover ${Menu} {
    display: flex;
  }
`;
const MenuItem = styled.div`
  border-radius: 50%;
  width: 18px;
  height: 18px;
  background: white;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

const Rate = styled.div`
  position: absolute;
  z-index: 10;
  color: ${({ theme }) => theme.text_primary};
  bottom: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  opacity: 0.9;
`;

const Details = styled.div`
  display: flex;
  gap: 6px;
  flex-direction: column;
  padding: 4px 10px;
`;
const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;
const Percent = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: green;
`;

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // 👇 Add this line to get currentUser from Redux
  const currentUser = useSelector((state) => state.user.currentUser);

  // 👇 Add this line to control auth modal (if you want to open modal instead of alert)
  // const [openAuth, setOpenAuth] = useState(false); // If you want to use modal

  const requireLogin = () => {
    alert("Please do signin or login first.");
    // Or use your snackbar:
    // dispatch(openSnackbar({ message: "Please do signin or login first.", severity: "warning" }));
  };

  const addFavorite = async () => {
    if (!currentUser) return requireLogin();
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await addToFavorite(token, { productId: product?._id })
      .then(() => {
        setFavorite(true);
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          requireLogin();
        } else {
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        }
      })
      .finally(() => setFavoriteLoading(false));
  };

  const removeFavorite = async () => {
    if (!currentUser) return requireLogin();
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await deleteFromFavorite(token, { productId: product?._id })
      .then(() => {
        setFavorite(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          requireLogin();
        } else {
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        }
      })
      .finally(() => setFavoriteLoading(false));
  };

  const addCart = async () => {
    if (!currentUser) return requireLogin();
    const token = localStorage.getItem("krist-app-token");
    await addToCart(token, { productId: product?._id, quantity: 1 })
      .then(() => {
        navigate("/cart");
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          requireLogin();
        } else {
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        }
      });
  };

  // Use useCallback to avoid useEffect warning
  const checkFavourite = useCallback(async () => {
    // Only check if logged in
    if (!currentUser) {
      setFavorite(false);
      return;
    }
    setFavoriteLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await getFavorite(token)
      .then((res) => {
        const isFavorite = res.data?.some(
          (favorite) => favorite._id === product?._id
        );
        setFavorite(isFavorite);
      })
      .catch((err) => {
        // Don't show 403 error if not logged in
        if (err.response && err.response.status === 403) {
          setFavorite(false);
        } else {
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        }
      })
      .finally(() => setFavoriteLoading(false));
  }, [dispatch, product?._id, currentUser]);

  useEffect(() => {
    checkFavourite();
  }, [checkFavourite]);

  return (
    <Card>
      <Top>
        <Image src={product?.img} loading="lazy" />
        <Menu>
          <MenuItem
            onClick={() => (favorite ? removeFavorite() : addFavorite())}
          >
            {favoriteLoading ? (
              <CircularProgress sx={{ fontSize: "20px" }} />
            ) : (
              <>
                {favorite ? (
                  <FavoriteRounded sx={{ fontSize: "20px", color: "red" }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: "20px" }} />
                )}
              </>
            )}
          </MenuItem>{" "}
          <MenuItem onClick={addCart}>
            <AddShoppingCartOutlined
              sx={{ color: "inherit", fontSize: "20px" }}
            />
          </MenuItem>
        </Menu>
        <Rate>
          <Rating value={3.5} sx={{ fontSize: "14px" }} />
        </Rate>
      </Top>
      <Details onClick={() => navigate(`/shop/${product._id}`)}>
        <Title>{product?.title}</Title>
        <Desc>{product?.name}</Desc>
        <Price>
          ₹{product?.price?.org} <Span>₹{product?.price?.mrp}</Span>
          <Percent>₹{product?.price?.off}% Off</Percent>
        </Price>
      </Details>
    </Card>
  );
};

export default ProductCard;

