import React from "react";
import styled from "styled-components";
import ProductCard from "../components/cards/ProductCard";
import { sampleProducts } from "../utils/data"; // Import sample data

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
  font-size: 2rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
`;

const NewArrival = () => {
  // Removed all fetching logic (useState, useEffect, fetchNewProducts)
  // We will now use the static 'sampleProducts' array directly.

  return (
    <Container>
      <Wrapper>
        <Title>New Arrivals</Title>
        <CardWrapper>
          {sampleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </CardWrapper>
      </Wrapper>
    </Container>
  );
};

export default NewArrival;