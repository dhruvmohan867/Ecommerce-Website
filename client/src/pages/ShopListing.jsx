import React, { useEffect, useState, useCallback } from "react"; // <-- Import useCallback
import ProductCard from "../components/cards/ProductCard.jsx";
import styled from "styled-components";
import { filter } from "../utils/data.js";
import { CircularProgress, Slider, Pagination, Checkbox, FormControlLabel } from "@mui/material";
import { getAllProducts } from "../api/index.js";

const Container = styled.div`
  display: flex;
  gap: 30px;
  padding: 40px 30px;
  width: 100%; /* Use full width */
  @media (max-width: 960px) {
    flex-direction: column;
    padding: 20px 16px;
  }
`;

const Filters = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (max-width: 960px) {
    width: 100%;
  }
`;
const FilterSection = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radii.large};
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: 16px;
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Products = styled.div`
  flex-grow: 1;
`;
const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

// --- Component ---
const minPrice = 0;
const maxPrice = 1000;

const ShopListing = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const getFilteredProductsData = useCallback(async () => { // <-- Wrap function in useCallback
    setLoading(true);
    try {
      const params = {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sizes: selectedSizes.join(","),
        categories: selectedCategories.join(","),
        page,
        limit: 12,
      };
      const res = await getAllProducts(params);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (e) {
      console.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  }, [priceRange, selectedSizes, selectedCategories, page]); // <-- Add dependencies to useCallback

  useEffect(() => {
    getFilteredProductsData();
  }, [getFilteredProductsData]); // <-- Use the memoized function as the dependency

  return (
    <Container>
      <Filters>
        {filter.map((filters) => (
          <FilterSection key={filters.name}>
            <Title>{filters.name}</Title>
            <Menu>
              {filters.value === "price" ? (
                <Slider
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue)}
                  min={minPrice}
                  max={maxPrice}
                  valueLabelDisplay="auto"
                  sx={{ color: 'primary.main' }}
                />
              ) : filters.value === "size" ? (
                filters.items.map((item) => (
                  <FormControlLabel
                    key={item}
                    control={<Checkbox checked={selectedSizes.includes(item)} onChange={() => handleSizeChange(item)} />}
                    label={item}
                  />
                ))
              ) : filters.value === "category" ? (
                filters.items.map((item) => (
                  <FormControlLabel
                    key={item}
                    control={<Checkbox checked={selectedCategories.includes(item)} onChange={() => handleCategoryChange(item)} />}
                    label={item}
                  />
                ))
              ) : null}
            </Menu>
          </FilterSection>
        ))}
      </Filters>
      <Products>
        {loading ? (
          <LoadingContainer><CircularProgress /></LoadingContainer>
        ) : (
          <>
            <CardWrapper>
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p>No products found.</p>
              )}
            </CardWrapper>
            {totalPages > 1 && (
              <PaginationContainer>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </PaginationContainer>
            )}
          </>
        )}
      </Products>
    </Container>
  );
};

export default ShopListing;
