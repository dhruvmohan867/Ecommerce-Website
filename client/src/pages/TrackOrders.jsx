import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 40px;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const TrackOrders = () => {
  const navigate = useNavigate();

  // Dummy orders for now (you can later fetch from backend)
  const dummyOrders = [
    {
      id: "ORD123456",
      product: "Floral Kurti - Blue",
      quantity: 2,
      total: 999,
      status: "Delivered",
      date: "12 June 2025",
    },
    {
      id: "ORD987654",
      product: "Anarkali Kurti",
      quantity: 1,
      total: 599,
      status: "Shipped",
      date: "15 June 2025",
    },
  ];

  return (
    <Container>
      <Title>Track Your Orders</Title>

      {dummyOrders.length === 0 ? (
        <>
          <p style={{ color: "#777", fontSize: "18px" }}>
            You haven't placed any orders yet.
          </p>
          <Button onClick={() => navigate("/")}>Shop Now</Button>
        </>
      ) : (
        dummyOrders.map((order) => (
          <OrderCard key={order.id}>
            <Row><strong>Order ID:</strong> {order.id}</Row>
            <Row><strong>Product:</strong> {order.product}</Row>
            <Row><strong>Quantity:</strong> {order.quantity}</Row>
            <Row><strong>Total:</strong> ₹{order.total}</Row>
            <Row><strong>Status:</strong> {order.status}</Row>
            <Row><strong>Date:</strong> {order.date}</Row>
          </OrderCard>
        ))
      )}
    </Container>
  );
};

export default TrackOrders;
