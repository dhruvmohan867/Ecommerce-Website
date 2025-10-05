import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MenuRounded, SearchRounded, ShoppingCartOutlined, FavoriteBorder,
  DarkMode, LightMode, LogoutOutlined
} from "@mui/icons-material";
import { Avatar, Badge } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/userSlice";
import LogoImg from "../utils/Images/Logo.png";

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.colors.card};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: top 0.3s ease-in-out; /* Add transition for smooth hiding/showing */
  top: ${({ visible }) => (visible ? "0" : "-80px")}; /* Control visibility */
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLogo = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const Logo = styled.img`
  height: 40px;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  padding: 8px 4px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }
  &.active::after, &:hover::after {
    width: 100%;
  }
  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const MobileIcon = styled(IconButton)`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

const AuthButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 8px 20px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const Navbar = ({ setOpenAuth, theme, setTheme }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      // Show navbar if scrolling up or at the top
      if (window.scrollY < lastScrollY || window.scrollY < 100) {
        setVisible(true);
      } else { // Hide if scrolling down
        setVisible(false);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <Nav visible={visible}>
      <NavContainer>
        <NavLogo to="/">
          <Logo src={LogoImg} alt="Logo" />
          SwiftCart
        </NavLogo>

        <NavItems>
          <StyledNavLink to="/">Home</StyledNavLink>
          <StyledNavLink to="/shop">Shop</StyledNavLink>
          <StyledNavLink to="/new-arrivals">New Arrivals</StyledNavLink>
          <StyledNavLink to="/orders">Orders</StyledNavLink>
        </NavItems>

        <ButtonContainer>
          <IconButton><SearchRounded /></IconButton>
          <IconButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
          
          {currentUser ? (
            <>
              <IconButton onClick={() => navigate('/favorite')}>
                <FavoriteBorder />
              </IconButton>
              <IconButton onClick={() => navigate('/cart')}>
                <Badge badgeContent={currentUser.cart?.length} color="primary">
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>
              <IconButton onClick={() => dispatch(logout())}>
                <LogoutOutlined />
              </IconButton>
              <Avatar src={currentUser.img} sx={{ width: 32, height: 32 }}>
                {currentUser.name[0]}
              </Avatar>
            </>
          ) : (
            <AuthButton onClick={() => setOpenAuth(true)}>
              Sign In
            </AuthButton>
          )}
          <MobileIcon>
            <MenuRounded />
          </MobileIcon>
        </ButtonContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;