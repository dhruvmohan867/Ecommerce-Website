import React, { useEffect, useState } from "react";
import ProductCard from "../components/cards/ProductCard.jsx";
import styled from "styled-components";
import { filter } from "../utils/data.js";
import { CircularProgress, Slider } from "@mui/material";
import { getAllProducts } from "../api/index.js";

// --- Styled components ---
const Container = styled.div`
  padding: 20px 30px;
  height: 100vh;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
    flex-direction: column;
    overflow-y: scroll;
  }
  background: ${({ theme }) => theme.bg};
`;
const Filters = styled.div`
  width: 100%;
  height: fit-content;
  overflow-y: hidden;
  padding: 20px 16px;
  @media (min-width: 768px) {
    height: 100%;
    width: 230px;
    overflow-y: scroll;
  }
`;
const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Products = styled.div`
  padding: 12px;
  overflow: hidden;
  height: fit-content;
  @media (min-width: 768px) {
    width: 100%;
    overflow-y: scroll;
    height: 100%;
  }
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

const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SelectableItem = styled.div`
  cursor: pointer;
  display: flex;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  color: ${({ theme }) => theme.text_secondary + 90};
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 16px;
  width: fit-content;
  ${({ selected, theme }) =>
    selected &&
    `
  border: 1.5px solid ${theme.text_primary};
  color: ${theme.text_primary};
  background: ${theme.text_primary + 30};
  font-weight: 500;
  `}
`;

// --- Component ---
const minPrice = 0;
const maxPrice = 1000;

const ShopListing = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  // Controlled price filter for API (after user commits changes)
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  // Temporary UI state for slider thumb as you drag
  const [pendingRange, setPendingRange] = useState([minPrice, maxPrice]);
  const [selectedSizes, setSelectedSizes] = useState(["S", "M", "L", "XL"]);
  const [selectedCategories, setSelectedCategories] = useState([
    "Men", "Women", "Kids", "Bags"
  ]);
  const [error, setError] = useState(null);

  // Sync pendingRange whenever priceRange changes externally
  useEffect(() => {
    setPendingRange(priceRange);
  }, [priceRange]);

  // Get products with current filters
  const getFilteredProductsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllProducts(
        `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}${
          selectedSizes.length > 0 ? `&sizes=${selectedSizes.join(",")}` : ""
        }${
          selectedCategories.length > 0
            ? `&categories=${selectedCategories.join(",")}`
            : ""
        }`
      );
      setProducts(res.data);
    } catch (e) {
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Refetch products when filters change
  useEffect(() => {
    getFilteredProductsData();
    // eslint-disable-next-line
  }, [priceRange, selectedSizes, selectedCategories]);

  return (
    <Container>
      <Filters>
        <Menu>
          {filter.map((filters) => (
            <FilterSection key={filters.name}>
              <Title>{filters.name}</Title>
              {filters.value === "price" ? (
                <Slider
                  aria-label="Price"
                  value={pendingRange}
                  min={minPrice}
                  max={maxPrice}
                  id="price"
                  valueLabelDisplay="auto"
                  marks={[
                    { value: minPrice, label: `$${minPrice}` },
                    { value: maxPrice, label: `$${maxPrice}` },
                  ]}
                  onChange={(event, value) => setPendingRange(value)}
                  onChangeCommitted={(event, value) => setPriceRange(value)}
                />
              ) : filters.value === "size" ? (
                <Item>
                  {filters.items.map((item) => (
                    <SelectableItem
                      key={item}
                      selected={selectedSizes.includes(item)}
                      onClick={() =>
                        setSelectedSizes((prevSizes) =>
                          prevSizes.includes(item)
                            ? prevSizes.filter((size) => size !== item)
                            : [...prevSizes, item]
                        )
                      }
                    >
                      {item}
                    </SelectableItem>
                  ))}
                </Item>
              ) : filters.value === "category" ? (
                <Item>
                  {filters.items.map((item) => (
                    <SelectableItem
                      key={item}
                      selected={selectedCategories.includes(item)}
                      onClick={() =>
                        setSelectedCategories((prevCategories) =>
                          prevCategories.includes(item)
                            ? prevCategories.filter((cat) => cat !== item)
                            : [...prevCategories, item]
                        )
                      }
                    >
                      {item}
                    </SelectableItem>
                  ))}
                </Item>
              ) : null}
            </FilterSection>
          ))}
        </Menu>
      </Filters>
      <Products>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <div style={{ color: "red", textAlign: "center" }}>{error}</div>
        ) : (
          <CardWrapper>
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div style={{ color: "#888", textAlign: "center", margin: "20px auto" }}>
                No products found.
              </div>
            )}
          </CardWrapper>
        )}
      </Products>
    </Container>
  );
};

export default ShopListing;
