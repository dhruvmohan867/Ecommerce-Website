import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import styled from "styled-components";
import { AddShoppingCartOutlined, FavoriteBorder, FavoriteRounded } from "@mui/icons-material";
import { addToCart, addToFavorite, deleteFromFavorite, getFavorite } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";

const Card = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.large};
  overflow: hidden;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px ${({ theme }) => theme.colors.shadowHover};
    border-color: transparent;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  padding-top: 125%; /* 4:5 Aspect Ratio */
  position: relative;
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const HoverActions = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(10px);
  transition: ${({ theme }) => theme.transition};
  ${Card}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transition};
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: scale(1.1);
  }
`;

const Details = styled.div`
  padding: 16px;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const Price = styled.p`
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      dispatch(openSnackbar({ message: "Please sign in to add items to your cart.", severity: "warning" }));
      return;
    }
    addToCart(localStorage.getItem("krist-app-token"), { productId: product._id, quantity: 1 })
      .then(() => {
        dispatch(openSnackbar({ message: "Added to cart!", severity: "success" }));
      })
      .catch(err => dispatch(openSnackbar({ message: err.message, severity: "error" })));
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      dispatch(openSnackbar({ message: "Please sign in to manage favorites.", severity: "warning" }));
      return;
    }
    const token = localStorage.getItem("krist-app-token");
    try {
      if (isFavorite) {
        await deleteFromFavorite(token, { productId: product._id });
        setIsFavorite(false);
      } else {
        await addToFavorite(token, { productId: product._id });
        setIsFavorite(true);
      }
    } catch (err) {
      dispatch(openSnackbar({ message: err.message, severity: "error" }));
    }
  };

  const checkIsFavorite = useCallback(async () => {
    if (!currentUser) return;
    try {
      const token = localStorage.getItem("krist-app-token");
      const res = await getFavorite(token);
      setIsFavorite(res.data?.some((fav) => fav._id === product?._id));
    } catch (err) { /* Silently fail */ }
  }, [product?._id, currentUser]);

  useEffect(() => {
    checkIsFavorite();
  }, [checkIsFavorite]);

  return (
    <Card onClick={() => navigate(`/shop/${product._id}`)}>
      <ImageContainer>
        <Image src={product?.img} loading="lazy" />
        <HoverActions>
          <ActionButton onClick={handleToggleFavorite}>
            {isFavorite ? <FavoriteRounded sx={{ color: '#EF4444' }} /> : <FavoriteBorder />}
          </ActionButton>
          <ActionButton onClick={handleAddToCart}>
            <AddShoppingCartOutlined />
          </ActionButton>
        </HoverActions>
      </ImageContainer>
      <Details>
        <Title>{product?.title}</Title>
        <Price>₹{product?.price?.org}</Price>
      </Details>
    </Card>
  );
};

export default ProductCard;

