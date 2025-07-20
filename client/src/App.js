import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "./utils/Themes";  // ✅ Uncommented and fixed
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx"; // ✅ Case-sensitive and correct path
import Home from "./pages/Home.jsx";
import Authentication from "./pages/Authentication.jsx";
import ShopListing from "./pages/ShopListing.jsx";
import Favourite from "./pages/Favourite.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import ToastMessage from "./components/ToastMessage.jsx";
import TrackOrders from "./pages/TrackOrders.jsx"; // ✅ Added missing import

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

function App() {
  const { currentUser, open, message, severity } = useSelector((state) => state.user); // ✅ Combined selector
  const [openAuth, setOpenAuth] = useState(false);

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container>
          <Navbar setOpenAuth={setOpenAuth} currentUser={currentUser} />

          <Routes>
            <Route path="/" element={<Home />} />                {/* ✅ Removed exact */}
            <Route path="/shop" element={<ShopListing />} />
            <Route path="/favorite" element={<Favourite />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop/:id" element={<ProductDetails />} />
            <Route path = "/Orders" element = {<TrackOrders/>} />
          </Routes>

          {openAuth && (
            <Authentication openAuth={openAuth} setOpenAuth={setOpenAuth} />
          )}

          {open && (
            <ToastMessage open={open} message={message} severity={severity} />
          )}
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
