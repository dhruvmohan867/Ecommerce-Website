import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import ProductCategoryCard from "../components/cards/ProductCategoryCard.jsx";
import ProductCard from "../components/cards/ProductCard.jsx";
import { getAllProducts } from "../api/index.js";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import HeroImage from "../utils/Images/HeroImage.png"; // Changed to use HeroImage.png
import { category } from "../utils/data.js";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  animation: ${fadeIn} 0.8s ease-out;
`;

const HeroSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 40px;
  /* Adjusting the vertical position from 'center' to '40%' to slide the image up slightly */
  background: url(${HeroImage}) no-repeat center 40% / cover;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2));
  }
`;

const HeroContent = styled.div`
  position: relative;
  max-width: 700px;
  color: white;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-right: auto;
  padding-top: 80px; /* Add padding to account for navbar height */
`;

const HeroTitle = styled.h1`
  font-family: "Calistoga", serif;
  font-size: 3.2rem; /* Reduced font size */
  line-height: 1.1;
  text-shadow: 0 4px 12px rgba(0,0,0,0.4);
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const HeroDesc = styled.p`
  font-size: 1.1rem; /* Reduced font size */
  max-width: 500px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;

const Section = styled.section`
  max-width: 1600px;
  margin: 0 auto;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem; /* Reduced font size */
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
`;

// New styled component for the category section
const CategoryWrapper = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 16px 0;
  scrollbar-width: none; /* For Firefox */
  &::-webkit-scrollbar {
    display: none; /* For Chrome, Safari, and Opera */
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 100px 0;
`;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts({ limit: 8 });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Where Style Meets Comfort</HeroTitle>
          <HeroDesc>
            Explore our curated collection of premium apparel, designed for the modern individual.
          </HeroDesc>
          <Button text="Explore Collection" onClick={() => navigate('/shop')} size="large" />
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionTitle>Shop by Category</SectionTitle>
        <CategoryWrapper> {/* Use the new wrapper here */}
          {category.map((cat) => (
            <ProductCategoryCard key={cat.name} category={cat} />
          ))}
        </CategoryWrapper>
      </Section>

      <Section style={{ background: 'theme.colors.card' }}>
        <SectionTitle>Featured Products</SectionTitle>
        {loading ? (
          <LoadingContainer><CircularProgress color="inherit" /></LoadingContainer>
        ) : (
          <CardWrapper>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </CardWrapper>
        )}
      </Section>
    </Container>
  );
};

export default Home;