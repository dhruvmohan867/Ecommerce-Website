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
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease, top 0.3s ease-in-out;
  
  /* New logic for background and border */
  background-color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.card : "transparent"};
  border-bottom: 1px solid ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.border : "transparent"};

  /* Hide on scroll down logic */
  top: ${({ visible }) => (visible ? "0" : "-80px")};
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
  /* Change color based on scroll for better visibility */
  color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.textPrimary : "white"};
  text-shadow: ${({ isScrolled }) =>
    isScrolled ? "none" : "0 1px 3px rgba(0,0,0,0.3)"};
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
  /* Change color based on scroll */
  color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.textSecondary : "rgba(255, 255, 255, 0.8)"};
  text-shadow: ${({ isScrolled }) =>
    isScrolled ? "none" : "0 1px 3px rgba(0,0,0,0.3)"};

  &:hover {
    color: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.textPrimary : "white"};
  }

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
    color: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.primary : "white"};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  /* Change color based on scroll */
  color: ${({ theme, isScrolled }) =>
    isScrolled ? theme.colors.textSecondary : "rgba(255, 255, 255, 0.9)"};
  padding: 8px;
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;
  &:hover {
    background-color: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.background : "rgba(255,255,255,0.1)"};
    color: ${({ theme, isScrolled }) =>
      isScrolled ? theme.colors.textPrimary : "white"};
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
  const [isScrolled, setIsScrolled] = useState(false); // New state for scroll tracking

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      // Set scrolled state
      setIsScrolled(window.scrollY > 10);

      // Hide on scroll down logic
      if (window.scrollY < lastScrollY || window.scrollY < 100) {
        setVisible(true);
      } else {
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
    <Nav visible={visible} isScrolled={isScrolled}>
      <NavContainer>
        <NavLogo to="/" isScrolled={isScrolled}>
          <Logo src={LogoImg} alt="Logo" />
          SwiftCart
        </NavLogo>

        <NavItems>
          <StyledNavLink to="/" isScrolled={isScrolled}>Home</StyledNavLink>
          <StyledNavLink to="/shop" isScrolled={isScrolled}>Shop</StyledNavLink>
          <StyledNavLink to="/new-arrivals" isScrolled={isScrolled}>New Arrivals</StyledNavLink>
          <StyledNavLink to="/orders" isScrolled={isScrolled}>Orders</StyledNavLink>
        </NavItems>

        <ButtonContainer>
          <IconButton isScrolled={isScrolled}><SearchRounded /></IconButton>
          <IconButton isScrolled={isScrolled} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
          
          {currentUser ? (
            <>
              <IconButton isScrolled={isScrolled} onClick={() => navigate('/favorite')}>
                <FavoriteBorder />
              </IconButton>
              <IconButton isScrolled={isScrolled} onClick={() => navigate('/cart')}>
                <Badge badgeContent={currentUser.cart?.length} color="primary">
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>
              <IconButton isScrolled={isScrolled} onClick={() => dispatch(logout())}>
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
          <MobileIcon isScrolled={isScrolled}>
            <MenuRounded />
          </MobileIcon>
        </ButtonContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;