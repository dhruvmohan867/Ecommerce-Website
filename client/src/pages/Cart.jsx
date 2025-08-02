// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput.jsx";
import Button from "../components/Button.jsx";
import { addToCart, deleteFromCart, getCart, placeOrder } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/snackbarSlice.js";
import { DeleteOutline } from "@mui/icons-material";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  background: ${({ theme }) => theme.bg};
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
`;

const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  gap: 28px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 12px;
  @media (max-width: 750px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 1.2;
  }
`;

const Table = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 30px;
  ${({ head }) => head && `margin-bottom: 22px`}
`;

const TableItem = styled.div`
  ${({ flex }) => flex && `flex: 1; `}
  ${({ bold }) =>
    bold &&
    `font-weight: 600; 
  font-size: 18px;`}
`;

const Counter = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.text_secondary + "40"};
  border-radius: 8px;
  padding: 4px 12px;
`;

const Product = styled.div`
  display: flex;
  gap: 16px;
`;

const Img = styled.img`
  height: 80px;
`;

const Details = styled.div``;

const Protitle = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  font-weight: 500;
`;

const ProDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProSize = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 0.8;
  }
`;

const Subtotal = styled.div`
  font-size: 22px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;

const Delivery = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  gap: 6px;
  flex-direction: column;
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
    try {
      const res = await getCart(token);
      setProducts(res.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [reload]);

  const calculateSubtotal = () =>
    products.reduce(
      (total, item) => total + item.quantity * item.product.price.org,
      0
    );

  const convertAddressToString = (a) =>
    `${a.firstName} ${a.lastName}, ${a.completeAddress}, ${a.phoneNumber}, ${a.emailAddress}`;

  const handlePlaceOrder = async () => {
    setButtonLoad(true);
    const { firstName, lastName, completeAddress, phoneNumber, emailAddress } =
      deliveryDetails;

    if (!firstName || !lastName || !completeAddress || !phoneNumber || !emailAddress) {
      dispatch(
        openSnackbar({ message: "Fill all delivery details", severity: "error" })
      );
      setButtonLoad(false);
      return;
    }

    const orderPayload = {
      products: products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      address: convertAddressToString(deliveryDetails),
      total_amount: calculateSubtotal().toFixed(2),
    };

    try {
      const token = localStorage.getItem("krist-app-token");
      await placeOrder(token, orderPayload);
      dispatch(openSnackbar({ message: "Order placed successfully", severity: "success" }));
      setOrderSuccess(true);
      setProducts([]);
    } catch {
      dispatch(openSnackbar({ message: "Failed to place order", severity: "error" }));
    } finally {
      setButtonLoad(false);
    }
  };

  const addItem = async (id) => {
    await addToCart(localStorage.getItem("krist-app-token"), { productId: id, quantity: 1 });
    setReload(!reload);
  };

  const removeItem = async (id, quantity, full = false) => {
    const token = localStorage.getItem("krist-app-token");
    let q = full ? null : 1;
    await deleteFromCart(token, { productId: id, quantity: q });
    setReload(!reload);
  };

  if (orderSuccess) {
    return (
      <Container>
        <Section>
          <h2>🎉 Order Placed Successfully!</h2>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        <Section>
          <Title>Your Shopping Cart</Title>
          {products.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <Wrapper>
              <Left>
                <Table head>
                  <TableItem bold flex>Product</TableItem>
                  <TableItem bold>Price</TableItem>
                  <TableItem bold>Quantity</TableItem>
                  <TableItem bold>Subtotal</TableItem>
                  <TableItem />
                </Table>
                {products.map((item) => (
                  <Table key={item.product._id}>
                    <TableItem flex>
                      <Product>
                        <Img src={item.product.img} alt={item.product.title} />
                        <Details>
                          <Protitle>{item.product.title}</Protitle>
                          <ProDesc>{item.product.name}</ProDesc>
                          <ProSize>Size: XL</ProSize>
                        </Details>
                      </Product>
                    </TableItem>
                    <TableItem>₹{item.product.price.org}</TableItem>
                    <TableItem>
                      <Counter>
                        <div onClick={() => removeItem(item.product._id, item.quantity)} style={{ cursor: "pointer" }}>-</div>
                        <span>{item.quantity}</span>
                        <div onClick={() => addItem(item.product._id)} style={{ cursor: "pointer" }}>+</div>
                      </Counter>
                    </TableItem>
                    <TableItem>
                      ₹{(item.quantity * item.product.price.org).toFixed(2)}
                    </TableItem>
                    <TableItem>
                      <DeleteOutline
                        sx={{ color: "red" }}
                        onClick={() => removeItem(item.product._id, item.quantity, true)}
                      />
                    </TableItem>
                  </Table>
                ))}
              </Left>
              <Right>
                <Subtotal>
                  Subtotal: ₹{calculateSubtotal().toFixed(2)}
                </Subtotal>
                <Delivery>
                  Delivery Details:
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <TextInput small placeholder="First Name" value={deliveryDetails.firstName} handleChange={e => setDeliveryDetails({ ...deliveryDetails, firstName: e.target.value })} />
                    <TextInput small placeholder="Last Name" value={deliveryDetails.lastName} handleChange={e => setDeliveryDetails({ ...deliveryDetails, lastName: e.target.value })} />
                  </div>
                  <TextInput small placeholder="Email Address" value={deliveryDetails.emailAddress} handleChange={e => setDeliveryDetails({ ...deliveryDetails, emailAddress: e.target.value })} />
                  <TextInput small placeholder="Phone Number" value={deliveryDetails.phoneNumber} handleChange={e => setDeliveryDetails({ ...deliveryDetails, phoneNumber: e.target.value })} />
                  <TextInput small textArea rows="4" placeholder="Complete Address" value={deliveryDetails.completeAddress} handleChange={e => setDeliveryDetails({ ...deliveryDetails, completeAddress: e.target.value })} />
                </Delivery>
                <Button text="Place Order" small isLoading={buttonLoad} isDisabled={buttonLoad} onClick={handlePlaceOrder} />
              </Right>
            </Wrapper>
          )}
        </Section>
      )}
    </Container>
  );
};

export default Cart;