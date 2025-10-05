import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput.jsx";
import Button from "../components/Button.jsx";
import { addToCart, deleteFromCart, getCart, placeOrder } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice.js";
import { DeleteOutline, Add, Remove, CheckCircle } from "@mui/icons-material";

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bgLight};
  padding: 40px 20px;
  
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 24px;
  }
`;

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CartCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.border_color};
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};
`;

const CartItem = styled.div`
  display: flex;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border_color};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const ItemImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  background: ${({ theme }) => theme.bgLight};
  flex-shrink: 0;
  
  @media (max-width: 600px) {
    width: 100%;
    height: 200px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const ItemDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.5;
`;

const ItemPrice = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-top: auto;
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 8px;
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.border_color};
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
  
  &:active {
    transform: scale(0.9);
  }
`;

const Quantity = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  min-width: 24px;
  text-align: center;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.red};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.red}15;
  }
`;

const OrderSummary = styled(CartCard)`
  position: sticky;
  top: 100px;
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
`;

const SummaryTotal = styled(SummaryRow)`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  padding-top: 16px;
  border-top: 2px solid ${({ theme }) => theme.border_color};
  margin-top: 8px;
  margin-bottom: 24px;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const FormTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 16px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SuccessModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const SuccessCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 24px;
  padding: 48px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 600px) {
    padding: 32px 24px;
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, ${({ theme }) => theme.green}, ${({ theme }) => theme.secondary});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 48px;
    color: white;
  }
`;

const SuccessTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 12px;
`;

const SuccessMessage = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 32px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 80px 20px;
  
  h2 {
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin-bottom: 12px;
  }
  
  p {
    font-size: 16px;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 32px;
  }
`;

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [products, setProducts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    completeAddress: "",
  });

  const getProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("krist-app-token");
    await getCart(token).then((res) => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const addCartItem = async (id) => {
    const token = localStorage.getItem("krist-app-token");
    await addToCart(token, { productId: id, quantity: 1 })
      .then(() => setReload(!reload))
      .catch((err) => {
        setReload(!reload);
        dispatch(openSnackbar({ message: err.message, severity: "error" }));
      });
  };

  const removeCartItem = async (id, quantity, type) => {
    const token = localStorage.getItem("krist-app-token");
    let qnt = quantity > 0 ? 1 : null;
    if (type === "full") qnt = null;
    await deleteFromCart(token, { productId: id, quantity: qnt })
      .then(() => setReload(!reload))
      .catch((err) => {
        setReload(!reload);
        dispatch(openSnackbar({ message: err.message, severity: "error" }));
      });
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (total, item) => total + item.quantity * ((item?.product?.price?.org || 0) * 10),
      0
    );
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, [reload]);

  const convertAddressToString = (addressObj) => {
    return `${addressObj.firstName} ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;
  };

  const PlaceOrder = async () => {
    setButtonLoad(true);
    try {
      const isFilled = Object.values(deliveryDetails).every((val) => val !== "");
      if (!isFilled) {
        dispatch(openSnackbar({ 
          message: "Please fill in all required delivery details.", 
          severity: "error" 
        }));
        setButtonLoad(false);
        return;
      }

      const token = localStorage.getItem("krist-app-token");
      const totalAmount = calculateSubtotal().toFixed(2);
      const orderDetails = {
        products,
        address: convertAddressToString(deliveryDetails),
        totalAmount,
      };

      await placeOrder(token, orderDetails);
      setOrderSuccess(true);
    } catch (error) {
      dispatch(openSnackbar({ 
        message: "Failed to place order. Please try again.", 
        severity: "error" 
      }));
    } finally {
      setButtonLoad(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <ContentWrapper style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </ContentWrapper>
      </Container>
    );
  }

  if (orderSuccess) {
    return (
      <SuccessModal>
        <SuccessCard>
          <SuccessIcon>
            <CheckCircle />
          </SuccessIcon>
          <SuccessTitle>Order Placed Successfully!</SuccessTitle>
          <SuccessMessage>
            Thank you for shopping with us. We're preparing your order and you'll receive updates soon.
          </SuccessMessage>
          <ButtonGroup>
            <Button text="Continue Shopping" onClick={() => navigate("/shop")} flex />
            <Button text="Track Orders" onClick={() => navigate("/orders")} type="secondary" flex />
          </ButtonGroup>
        </SuccessCard>
      </SuccessModal>
    );
  }

  if (products.length === 0) {
    return (
      <Container>
        <ContentWrapper>
          <EmptyCart>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Button text="Start Shopping" onClick={() => navigate("/shop")} />
          </EmptyCart>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <PageTitle>Shopping Cart</PageTitle>
        
        <CartLayout>
          <CartItems>
            <CartCard>
              {products.map((item) => (
                <CartItem key={item?._id || item?.product?._id}>
                  <ItemImage src={item?.product?.img} alt={item?.product?.title} />
                  
                  <ItemDetails>
                    <ItemTitle>{item?.product?.title}</ItemTitle>
                    <ItemDescription>{item?.product?.name}</ItemDescription>
                    <ItemPrice>₹{Math.round((item?.product?.price?.org || 0) * 10)}</ItemPrice>
                  </ItemDetails>
                  
                  <ItemActions>
                    <DeleteButton onClick={() => removeCartItem(item?.product?._id, item?.quantity - 1, "full")}>
                      <DeleteOutline />
                    </DeleteButton>
                    
                    <QuantityControl>
                      <QuantityButton onClick={() => removeCartItem(item?.product?._id, item?.quantity - 1)}>
                        <Remove fontSize="small" />
                      </QuantityButton>
                      <Quantity>{item?.quantity}</Quantity>
                      <QuantityButton onClick={() => addCartItem(item?.product?._id)}>
                        <Add fontSize="small" />
                      </QuantityButton>
                    </QuantityControl>
                  </ItemActions>
                </CartItem>
              ))}
            </CartCard>
          </CartItems>
          
          <OrderSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            <SummaryRow>
              <span>Subtotal</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Shipping</span>
              <span>Free</span>
            </SummaryRow>
            
            <SummaryTotal>
              <span>Total</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </SummaryTotal>
            
            <FormSection>
              <FormTitle>Delivery Details</FormTitle>
              <FormGrid>
                <TextInput
                  small
                  placeholder="First Name"
                  value={deliveryDetails.firstName}
                  handleChange={(e) => setDeliveryDetails({ ...deliveryDetails, firstName: e.target.value })}
                />
                <TextInput
                  small
                  placeholder="Last Name"
                  value={deliveryDetails.lastName}
                  handleChange={(e) => setDeliveryDetails({ ...deliveryDetails, lastName: e.target.value })}
                />
              </FormGrid>
              <div style={{ marginTop: '12px' }}>
                <TextInput
                  small
                  placeholder="Email Address"
                  value={deliveryDetails.emailAddress}
                  handleChange={(e) => setDeliveryDetails({ ...deliveryDetails, emailAddress: e.target.value })}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <TextInput
                  small
                  placeholder="Phone Number"
                  value={deliveryDetails.phoneNumber}
                  handleChange={(e) => setDeliveryDetails({ ...deliveryDetails, phoneNumber: e.target.value })}
                />
              </div>
              <div style={{ marginTop: '12px' }}>
                <TextInput
                  small
                  textArea
                  rows="4"
                  placeholder="Complete Address (Address, State, Country, Pincode)"
                  value={deliveryDetails.completeAddress}
                  handleChange={(e) => setDeliveryDetails({ ...deliveryDetails, completeAddress: e.target.value })}
                />
              </div>
            </FormSection>
            
            <Button
              text="Place Order"
              full
              isLoading={buttonLoad}
              isDisabled={buttonLoad}
              onClick={PlaceOrder}
            />
          </OrderSummary>
        </CartLayout>
      </ContentWrapper>
    </Container>
  );
};

export default Cart;