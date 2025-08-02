import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api/index.js";

const Container = styled.div`
  padding: 40px 20px;
  min-height: 80vh;
  background: ${({ theme }) => theme.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.text_primary};
`;

const OrderCard = styled.div`
  width: 100%;
  max-width: 800px;
  background: ${({ theme }) => theme.card};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const Row = styled.div`
  margin: 12px 0;
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Thumb = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ShopButton = styled.button`
  padding: 10px 20px;
  margin-top: 40px;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

const TrackOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("krist-app-token");
        const data = await getOrders(token);
        setOrders(Array.isArray(data) ? data : data.orders || []);
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
        <Title>No orders found</Title>
        <ShopButton onClick={() => navigate("/shop")}>Shop Now</ShopButton>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Track Your Orders</Title>
      {orders.map((order) => (
        <OrderCard key={order._id}>
          <Row><strong>Order ID:</strong> {order._id}</Row>
          <Row>
            <strong>Products:</strong>
            <ProductsList>
              {(order.products || []).map((item, idx) => (
                <ProductRow key={idx}>
                  {item.product?.img && <Thumb src={item.product.img} alt={item.product.title} />}
                  <div>
                    <div style={{ fontWeight: 500 }}>
                      {item.product?.title || item.product?.name || "Unknown"}
                    </div>
                    <div>Quantity: {item.quantity}</div>
                  </div>
                </ProductRow>
              ))}
            </ProductsList>
          </Row>
          <Row>
            <strong>Total:</strong> ₹{order.total_amount?.$numberDecimal ?? order.total_amount ?? "0.00"}
          </Row>
          <Row><strong>Status:</strong> {order.status || "N/A"}</Row>
          <Row>
            <strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
          </Row>
        </OrderCard>
      ))}
    </Container>
  );
};

export default TrackOrders;
