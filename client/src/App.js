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
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import NewArrival from "./pages/NewArrival.jsx";

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Main = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [openAuth, setOpenAuth] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    const handleThemeChange = () => {
      if (savedTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemPrefersDark ? 'dark' : 'light');
      } else {
        setTheme(savedTheme);
      }
    };

    handleThemeChange();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  const handleThemeUpdate = (newTheme) => {
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    } else {
      setTheme(newTheme);
    }
    document.body.classList.toggle('dark-mode', newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
  };
  
  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <BrowserRouter>
        <Frame>
          <Navbar setOpenAuth={setOpenAuth} currentUser={currentUser} theme={theme} setTheme={handleThemeUpdate} />
          <Main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopListing />} />
              <Route path="/favorite" element={<Favourite />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/shop/:id" element={<ProductDetails />} />
              <Route path="/new-arrivals" element={<NewArrival />} />
              <Route path="/orders" element={<TrackOrders />} />
            </Routes>
          </Main>
          {openAuth && <Authentication openAuth={openAuth} setOpenAuth={setOpenAuth} />}
          <ToastMessage open={open} message={message} severity={severity} />
        </Frame>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;