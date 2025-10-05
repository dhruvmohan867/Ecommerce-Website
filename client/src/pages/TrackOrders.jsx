// src/pages/TrackOrders.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api/index.js";
import Button from "../components/Button.jsx"; // Import the new Button component

const Container = styled.div`
  padding: 40px 20px;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

// New component for a better empty state
const EmptyContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  gap: 24px;
`;

const EmptyTitle = styled.h2`
  font-size: 2rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 450px;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.text_primary};
`;

const OrderCard = styled.div`
  width: 100%;
  max-width: 980px;
  background: ${({ theme }) => theme.card};
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 6px 24px ${({ theme }) => theme.shadow};
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.border_color};
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const OrderId = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  word-break: break-all;
`;

const StatusPill = styled.div`
  padding: 6px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  color: ${({ theme }) => theme.buttonText};
  background: ${({ theme }) => theme.primary};
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;
`;

const ProductItem = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  transition: background 0.15s ease;
  cursor: default;

  &:hover {
    background: ${({ theme }) => theme.bgLight + "10"};
  }
`;

const Thumb = styled.img`
  width: 84px;
  height: 84px;
  object-fit: cover;
  border-radius: 10px;
  background: #f5f5f5;
  flex-shrink: 0;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const ProductTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const ProductMeta = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const ProductRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const QtyBadge = styled.div`
  background: ${({ theme }) => theme.popup};
  color: ${({ theme }) => theme.popup_text_primary};
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.border_color};
`;

const Price = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border_color};
  margin: 6px 0;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FooterLeft = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const FooterRight = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const TotalAmount = styled.div`
  font-weight: 800;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
`;

const ShopButton = styled.button`
  padding: 10px 20px;
  margin-top: 8px;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  &:hover { opacity: 0.95; }
`;

const formatAmount = (val) => {
  if (val == null) return "0.00";
  if (typeof val === "object" && val.$numberDecimal) return Number(val.$numberDecimal).toFixed(2);
  return Number(val).toFixed(2);
};

const TrackOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("krist-app-token");
        const res = await getOrders(token);
        const serverOrders = Array.isArray(res.data) ? res.data : res.data.orders || [];
        setOrders(serverOrders);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <Container><p>Loading orders…</p></Container>;
  }

  if (orders.length === 0) {
    return (
      <Container>
        <EmptyContainer>
          <EmptyTitle>No Orders Yet</EmptyTitle>
          <EmptyText>
            It looks like you haven't placed any orders. Once you do, you'll be
            able to track them right here.
          </EmptyText>
          <Button text="Start Shopping" onClick={() => navigate("/shop")} />
        </EmptyContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Track Your Orders</Title>
      {orders.map((order) => (
        <OrderCard key={order._id}>
          <OrderHeader>
            <OrderId>Order ID: <span style={{ fontWeight: 500 }}>{order._id}</span></OrderId>
            <StatusPill>{order.status || "N/A"}</StatusPill>
          </OrderHeader>

          <ProductList>
            {(order.products || []).map((item) => {
              const prod = item.product || {};
              return (
                <ProductItem key={prod._id || item.product}>
                  <Thumb src={prod?.img || "/Pogo.webp"} alt={prod?.title || prod?.name || "Product"} onClick={() => prod._id && navigate(`/shop/${prod._id}`)} style={{ cursor: prod._id ? "pointer" : "default" }} />
                  <ProductInfo>
                    <ProductTitle>{prod?.title || prod?.name || "Unknown product"}</ProductTitle>
                    <ProductMeta>{prod?.desc ? (prod.desc.substring(0, 100) + (prod.desc.length > 100 ? "..." : "")) : (prod?.category?.[0] || "")}</ProductMeta>
                  </ProductInfo>
                  <ProductRight>
                    <QtyBadge>Qty: {item.quantity}</QtyBadge>
                    <Price>₹{formatAmount(prod?.price?.org ?? 0)}</Price>
                  </ProductRight>
                </ProductItem>
              );
            })}
          </ProductList>

          <Divider />

          <OrderFooter>
            <FooterLeft>
              <div><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</div>
              <div style={{ marginTop: 6, color: "inherit" }}>{order.address}</div>
            </FooterLeft>

            <FooterRight>
              <TotalAmount>₹{formatAmount(order.total_amount)}</TotalAmount>
              {/* Replaced old button with the new one for consistency */}
              <Button small text="Shop Again" onClick={() => navigate("/shop")} />
            </FooterRight>
          </OrderFooter>
        </OrderCard>
      ))}
    </Container>
  );
};

export default TrackOrders;
