import { CircularProgress, Rating } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import Button from "../components/Button.jsx";
import { FavoriteBorder, FavoriteRounded } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { openSnackbar } from "../redux/reducers/snackbarSlice.js";
import { useDispatch } from "react-redux";
import {
  addToCart,
  addToFavorite,
  deleteFromFavorite,
  getFavorite,
  getProductDetails,
} from "../api/index.js";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 99%;
  overflow-y: scroll;
`;
const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  width: 100%;
  padding: 12px;
  gap: 32px;
  @media (max-width: 750px) {
    flex-direction: column;
    justify-content: center;
  }
`;
const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Image = styled.img`
  height: 600px;
  border-radius: 12px;
  @media (max-width: 750px) {
    height: 400px;
  }
`;
const Details = styled.div`
  display: flex;
  gap: 18px;
  flex-direction: column;
  padding: 4px 10px;
  flex: 1;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
`;
const Name = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
`;
const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;
const Percent = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: green;
`;
const Sizes = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Items = styled.div`
  display: flex;
  gap: 12px;
`;
const Item = styled.div`
  border: 1px solid ${({ theme }) => theme.primary};
  font-size: 14px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ selected, theme }) =>
    selected &&
    `
  background: ${theme.primary};
  color: white;
  `}
`;
const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
  padding: 32px 0px;
  font-weight: 1000;
`;

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();
  const [selected, setSelected] = useState();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const getProduct = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductDetails(id);
      setProduct(res.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const addFavorite = async () => {
    const token = localStorage.getItem("krist-app-token");
    if (!token) {
      alert("Please do login or sign up first");
      return;
    }
    setFavoriteLoading(true);
    await addToFavorite(token, { productId: product?._id })
      .then(() => {
        setFavorite(true);
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
  };

  const removeFavorite = async () => {
    const token = localStorage.getItem("krist-app-token");
    if (!token) {
      alert("Please do login or sign up first");
      return;
    }
    setFavoriteLoading(true);
    await deleteFromFavorite(token, { productId: product?._id })
      .then(() => {
        setFavorite(false);
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
  };

  const addCart = async () => {
    const token = localStorage.getItem("krist-app-token");
    if (!token) {
      alert("Please do login or sign up first");
      return;
    }
    setCartLoading(true);
    await addToCart(token, { productId: product?._id, quantity: 1 })
      .then(() => {
        navigate("/cart");
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      })
      .finally(() => setCartLoading(false));
  };

  // Check favorite status after product is loaded
  useEffect(() => {
    if (!product) return;
    const token = localStorage.getItem("krist-app-token");
    if (!token) return; // don't check if not logged in
    setFavoriteLoading(true);
    getFavorite(token)
      .then((res) => {
        const isFavorite = res.data?.some((fav) => fav._id === product._id);
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
    getProduct();
  }, [getProduct]);

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        <Wrapper>
          <ImageWrapper>
            <Image src={product?.img} loading="lazy" />
          </ImageWrapper>
          <Details>
            <div>
              <Title>{product?.title}</Title>
              <Name>{product?.name}</Name>
            </div>
            <Rating value={3.5} />
            <Price>
              ₹{product?.price?.org} <Span>₹{product?.price?.mrp}</Span>{" "}
              <Percent> (₹{product?.price?.off}% Off) </Percent>
            </Price>
            <Desc>{product?.desc}</Desc>
            <Sizes>
              <Items>
                {product?.sizes?.map((size) => (
                  <Item
                    key={size}
                    selected={selected === size}
                    onClick={() => setSelected(size)}
                  >
                    {size}
                  </Item>
                ))}
              </Items>
            </Sizes>
            <ButtonWrapper>
              <Button
                text="Add to Cart"
                full
                outlined
                isLoading={cartLoading}
                onClick={() => addCart()}
              />
              <Button text="Buy Now" full onClick={() => addCart()} />
              <Button
                leftIcon={
                  favorite ? (
                    <FavoriteRounded sx={{ fontSize: "22px", color: "red" }} />
                  ) : (
                    <FavoriteBorder sx={{ fontSize: "22px" }} />
                  )
                }
                full
                outlined
                isLoading={favoriteLoading}
                onClick={() =>
                  favorite ? removeFavorite() : addFavorite()
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
