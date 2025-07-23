
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
const Img = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
  background: #eee;
`;

const  NewArrival = () => {
  const navigate = useNavigate();


  // Dummy orders for now (you can later fetch from backend)
  const dummyOrders = [
    {
      id: "ORD123456",
      product: "Floral Kurti - Blue",
      quantity: 2,
      total: 999,
      img : "https://banarasikargha.in/cdn/shop/files/IMGL4070.jpg?v=1687865619&width=700",
      status: "On the way",
      date: "12 June 2025",
    },
    {
      id: "ORD987654",
      product: "Anarkali Kurti",
      quantity: 1,
      total: 599,
      img : "https://cdn.vibecity.in/providers/64b2567eddeadc0011219a6c/1000045203_dbbd6eb1-ec7b-4115-99f6-526217f3f99b-3X.webp",
      status: "On the way",
      date: "15 June 2025",
    },
  ];


  return (
    <Container>
      <Title>New Products</Title>


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
            <Img src={order.img} alt={order.product} />
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


export default NewArrival; 