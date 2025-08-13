import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { category } from "../utils/data.js";
import ProductCategoryCard from "../components/cards/ProductCategoryCard.jsx";
import ProductCard from "../components/cards/ProductCard.jsx";
import { getAllProducts } from "../api/index.js";

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
const Img = styled.img`
  width: 90%;
  height: 700px;
  object-fit: cover;
  max-width: 1200px;
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

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllProducts();
      setProducts(res.data.products || []);
    } catch (err) {
      setError("Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container>
      <Section style={{ alignItems: "center" }}>
        <Img src="/Pogo.webp" alt="Header" />
      </Section>
      <Section>
        <Title>Shop by Categories</Title>
        <CardWrapper>
          {category.map((cat) => (
            <ProductCategoryCard key={cat.name} category={cat} />
          ))}
        </CardWrapper>
      </Section>
      <Section>
        <Title center>Our Bestseller</Title>
        <CardWrapper>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </CardWrapper>
      </Section>
    </Container>
  );
};

export default Home;