import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductCard from "../components/cards/ProductCard";
import { getFavorite } from "../api/index.js";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Section = styled.div`
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  @media (max-width: 750px) {
    gap: 14px;
  }
`;

const Favourite = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("krist-app-token");
      if (!token) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const res = await getFavorite(token);
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [reload]); // Reload when favorite changes

  return (
    <Container>
      <Section>
        <Title>Your favourites</Title>
        <CardWrapper>
          {loading ? (
            <CircularProgress />
          ) : products.length === 0 ? (
            <>No Products</>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onFavoriteChange={() => setReload(!reload)} // Trigger reload after change
              />
            ))
          )}
        </CardWrapper>
      </Section>
    </Container>
  );
};

export default Favourite;
