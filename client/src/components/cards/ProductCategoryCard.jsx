import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* Reduced gap */
  cursor: pointer;
  transition: transform 0.3s ease;
  flex-shrink: 0; /* Prevent cards from shrinking */
  width: 280px; /* Set a fixed width for consistency */

  &:hover {
    transform: translateY(-8px);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.large};
`;

const Image = styled.img`
  width: 100%;
  height: 320px; /* Reduced height */
  object-fit: cover;
  transition: transform 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.h3`
  font-size: 1.1rem; /* Reduced font size */
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Offer = styled.span`
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.secondary};
  background-color: ${({ theme }) => theme.colors.secondary}20;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
`;

const ProductCategoryCard = ({ category }) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/shop?category=${category.name}`)}>
      <ImageContainer>
        <Image src={category.img} />
      </ImageContainer>
      <Details>
        <Name>{category.name}</Name>
        <Offer>{category.off}</Offer>
      </Details>
    </Card>
  );
};

export default ProductCategoryCard;