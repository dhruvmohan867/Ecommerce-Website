import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAllProducts } from "../api";
import ProductCard from "../components/cards/ProductCard";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Container = styled.div`
  padding: 60px 30px;
  display: flex;
  justify-content: center;
  min-height: 80vh;
`;

const Wrapper = styled.div`
  max-width: 1400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Title = styled.h1`
  font-size: 2rem; /* Reduced from 2.25rem for a more refined look */
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  gap: 24px;
`;

const EmptyStateTitle = styled.h2`
  font-size: 2rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 450px;
`;

const NewArrival = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchNewProducts = async () => {
    setLoading(true);
    try {
      // Fetch the latest products. The backend sorts by latest by default.
      const res = await getAllProducts({ limit: 12 }); // Fetch up to 12 new items
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Failed to fetch new arrivals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewProducts();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>New Arrivals</Title>
        {loading ? (
          <LoadingContainer>
            <CircularProgress color="inherit" />
          </LoadingContainer>
        ) : products.length > 0 ? (
          <CardWrapper>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </CardWrapper>
        ) : (
          <EmptyStateContainer>
            <EmptyStateTitle>Stay Tuned</EmptyStateTitle>
            <EmptyStateText>
              We're currently updating our collection. Check back soon for the
              latest styles and new arrivals!
            </EmptyStateText>
            <Button text="Explore All Products" onClick={() => navigate("/shop")} />
          </EmptyStateContainer>
        )}
      </Wrapper>
    </Container>
  );
};

export default NewArrival;