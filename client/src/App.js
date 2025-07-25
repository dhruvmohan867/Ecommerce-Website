import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Authentication from "./pages/Authentication.jsx";
import ShopListing from "./pages/ShopListing.jsx";
import Favourite from "./pages/Favourite.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import ToastMessage from "./components/ToastMessage.jsx";
import TrackOrders from "./pages/TrackOrders.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import NewArrival from "./pages/NewArrival.jsx";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  transition: all 0.3s ease;
`;

function App() {
  const { currentUser, open, message, severity } = useSelector((state) => state.user);
  const [openAuth, setOpenAuth] = useState(false);
  const [themeMode, setThemeMode] = useState('light');
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setThemeMode(savedTheme);
    } else {
      // Detect system preference
      const systemPrefersDark = window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);
  
  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (localStorage.getItem('theme') === 'system') {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);
  
  // Determine which theme object to use
  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <BrowserRouter>
        <Container>
          <Navbar 
            setOpenAuth={setOpenAuth} 
            currentUser={currentUser}
            theme={themeMode}
            setTheme={setThemeMode}
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopListing />} />
            <Route path="/favorite" element={<Favourite />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop/:id" element={<ProductDetails />} />
           <Route path="/new-arrival" element={<NewArrival />} />
            <Route path="/orders" element={<TrackOrders/>} />
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