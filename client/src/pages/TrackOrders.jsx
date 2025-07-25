import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api";

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
  color: ${({ theme }) => theme.buttonText};
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const TrackOrders = () => {
  const navigate = useNavigate();
  const [orders, setorders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem("krist-app-token");
      try {
        const data = await getOrders(token);
        // If your controller returns orders array directly
        setorders(Array.isArray(data) ? data : data.orders || []);
      } catch (e) {
        setorders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container>
      <Title>Track Your Orders</Title>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <>
          <p style={{ color: "#777", fontSize: "18px" }}>
            You haven't placed any orders yet.
          </p>
          <Button onClick={() => navigate("/shop")}>Shop Now</Button>
        </>
      ) : (
        orders.map((order) => (
          <OrderCard key={order._id}>
            <Row><strong>Order ID:</strong> {order._id}</Row>
            <Row>
              <strong>Products:</strong>
              {order.products && order.products.length > 0
                ? order.products.map((prod, idx) =>
                    <div key={idx}>
                      {prod.product?.title || prod.product?.name || "Product"} x{prod.quantity}
                    </div>
                  )
                : "N/A"}
            </Row>
            <Row><strong>Total:</strong> ₹{order.total_amount?.$numberDecimal || order.total_amount}</Row>
            <Row><strong>Status:</strong> {order.status}</Row>
            <Row><strong>Date:</strong> {order.createdAt && (new Date(order.createdAt)).toLocaleString()}</Row>
          </OrderCard>
        ))
      )}
    </Container>
  );
};
export default TrackOrders;