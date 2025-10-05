import { CircularProgress, Rating } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import Button from "../components/Button.jsx";
import { FavoriteBorder, FavoriteRounded } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { openSnackbar } from "../redux/reducers/snackbarSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  addToFavorite,
  deleteFromFavorite,
  getFavorite,
  getProductDetails,
} from "../api/index.js";

const Container = styled.div`
  padding: 40px 30px;
  display: flex;
  justify-content: center;
  min-height: 100vh;
`;
const Wrapper = styled.div`
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const Image = styled.img`
  max-width: 100%;
  height: auto;
  max-height: 700px;
  border-radius: ${({ theme }) => theme.radii.large};
  object-fit: cover;
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Title = styled.h1`
  font-size: 2.2rem; /* Reduced from 2.5rem */
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const Desc = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;
const Price = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const Span = styled.span`
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`;
const Percent = styled.span`
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.success};
`;
const Sizes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;
const Items = styled.div`
  display: flex;
  gap: 12px;
`;
const Item = styled.div`
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : "transparent"};
  color: ${({ theme, selected }) =>
    selected ? theme.colors.buttonText : theme.colors.textPrimary};
  font-size: 1rem;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const getProduct = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductDetails(id);
      setProduct(res.data);
    } catch (err) {
      dispatch(
        openSnackbar({
          message: "Failed to load product details.",
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [id, dispatch]);

  const checkIsFavorite = useCallback(async () => {
    if (!currentUser || !product) return;
    try {
      const token = localStorage.getItem("krist-app-token");
      const res = await getFavorite(token);
      setIsFavorite(res.data?.some((fav) => fav._id === product._id));
    } catch (err) {
      /* Silently fail */
    }
  }, [product, currentUser]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  useEffect(() => {
    checkIsFavorite();
  }, [checkIsFavorite]);

  const handleAction = async (action, successMessage) => {
    if (!currentUser) {
      dispatch(
        openSnackbar({ message: "Please sign in to continue.", severity: "warning" })
      );
      return;
    }
    const token = localStorage.getItem("krist-app-token");
    try {
      await action(token, { productId: product._id, quantity: 1 });
      dispatch(openSnackbar({ message: successMessage, severity: "success" }));
      if (action === addToCart) navigate("/cart");
      if (action === addToFavorite) setIsFavorite(true);
      if (action === deleteFromFavorite) setIsFavorite(false);
    } catch (err) {
      dispatch(openSnackbar({ message: err.message, severity: "error" }));
    }
  };

  if (loading) {
    return (
      <Container style={{ minHeight: "80vh" }}>
        <CircularProgress color="inherit" />
      </Container>
    );
  }

  return (
    <Container>
      {product && (
        <Wrapper>
          <ImageWrapper>
            <Image src={product.img} />
          </ImageWrapper>
          <Details>
            <Title>{product.title}</Title>
            <Rating value={product.rating || 4.5} readOnly />
            <Price>
              ₹{Math.round(product.price.org * 10)}
              <Span>₹{Math.round(product.price.mrp * 10)}</Span>
              <Percent>{product.price.off}% OFF</Percent>
            </Price>
            <Desc>{product.desc}</Desc>

            {product.sizes?.length > 0 && (
              <Sizes>
                <SectionTitle>Select Size</SectionTitle>
                <Items>
                  {product.sizes.map((size) => (
                    <Item
                      key={size}
                      selected={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Item>
                  ))}
                </Items>
              </Sizes>
            )}

            <ButtonWrapper>
              <Button
                text="Add to Cart"
                full
                onClick={() => handleAction(addToCart, "Added to cart!")}
              />
              <Button
                text={isFavorite ? "Favorited" : "Favorite"}
                full
                outlined
                leftIcon={
                  isFavorite ? (
                    <FavoriteRounded sx={{ color: "#EF4444" }} />
                  ) : (
                    <FavoriteBorder />
                  )
                }
                onClick={() =>
                  handleAction(
                    isFavorite ? deleteFromFavorite : addToFavorite,
                    isFavorite ? "Removed from favorites" : "Added to favorites"
                  )
                }
              />
            </ButtonWrapper>
          </Details>
        </Wrapper>
      )}
    </Container>
  );
};

export default ProductDetails;
