import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LogoImg from "../utils/Images/logo1.jpeg";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import {
  FavoriteBorder,
  MenuRounded,
  SearchRounded,
  ShoppingCartOutlined,
  DarkMode,
  LightMode,
  SettingsBrightness
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { logout } from "../redux/reducers/userSlice";
import { useDispatch } from "react-redux";

const Nav = styled.div`
  background-color: ${({ theme }) => theme.navbar};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 1300;
  color: ${({ theme }) => theme.text_primary};
  border-bottom: 1px solid ${({ theme }) => theme.border_color};
  transition: all 0.3s ease;
`;

const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;

export const NavLogo = styled.a`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
`;

const Logo = styled.img`
  height: 34px;
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;
  
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
  
  &.active {
    color: ${({ theme }) => theme.secondary};
    border-bottom: 1.8px solid ${({ theme }) => theme.secondary};
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};
  // background-color: ${({ theme }) => theme.primary};
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileIcon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const Mobileicons = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  width: 80%;
  padding: 12px 40px 24px 40px;
  background: ${({ theme }) => theme.card};
  position: absolute;
  top: 80px;
  right: 0;
  transition: all 0.6s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? "translateY(0)" : "translateY(-100%)")};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
  border: 1px solid ${({ theme }) => theme.border_color};
`;

const TextButton = styled.div`
  text-align: end;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
`;

// Theme switcher components
const ThemeSwitcherContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThemeButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary}20;
    transform: rotate(15deg);
  }
  
  &:focus {
    outline: none;
  }
`;

const ThemeDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border_color};
  border-radius: 8px;
  padding: 8px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
  transform: ${({ $isOpen }) => ($isOpen ? "scale(1)" : "scale(0.95)")};
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transform-origin: top right;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const ThemeOption = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary}20;
  }
  
  svg {
    margin-right: 10px;
    font-size: 18px;
  }
`;

const Navbar = ({ openAuth, setOpenAuth, currentUser, theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const dispatch = useDispatch();

  // Handle theme change
  const handleThemeChange = (themeName) => {
    setTheme(themeName);
    setIsThemeMenuOpen(false);
  };

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isThemeMenuOpen && !e.target.closest('.theme-switcher-container')) {
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isThemeMenuOpen]);

  return (
    <Nav>
      <NavbarContainer>
        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded style={{ color: "inherit" }} />
        </MobileIcon>

        <NavLogo href="/">
          <Logo src={LogoImg} alt="Beach Resort" />
        </NavLogo>

        <NavItems>
          <Navlink to="/">Home</Navlink>
          <Navlink to="/shop">Shop</Navlink>
          <Navlink to="/new-arrivals">New Arrivals</Navlink>
          <Navlink to="/orders">Orders</Navlink>
        </NavItems>

        {isOpen && (
          <MobileMenu isOpen={isOpen}>
            <Navlink to="/" onClick={() => setIsOpen(!isOpen)}>
              Home
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/shop">
              Shop
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/new_Arrivals">
              New Arrivals
            </Navlink>
            <Navlink onClick={() => setIsOpen(!isOpen)} to="/orders">
              Orders
            </Navlink>
            
            {/* Theme options for mobile */}
            <ThemeOption onClick={() => handleThemeChange('light')}>
              <LightMode /> Light Mode
            </ThemeOption>
            <ThemeOption onClick={() => handleThemeChange('dark')}>
              <DarkMode /> Dark Mode
            </ThemeOption>
            <ThemeOption onClick={() => handleThemeChange('system')}>
              <SettingsBrightness /> 
            </ThemeOption>
            
            {currentUser ? (
              <Button text="Logout" small onClick={() => dispatch(logout())} />
            ) : (
              <div style={{ flex: "1", display: "flex", gap: "12px" }}>
                <Button
                  text="Sign Up"
                  outlined
                  small
                  onClick={() => setOpenAuth(!openAuth)}
                />
                <Button
                  text="Sign In"
                  small
                  onClick={() => setOpenAuth(!openAuth)}
                />
              </div>
            )}
          </MobileMenu>
        )}

        <Mobileicons>
          <Navlink to="/search">
            <SearchRounded sx={{ color: "inherit", fontSize: "30px" }} />
          </Navlink>

          {currentUser ? (
            <>
              <Navlink to="/favorite">
                <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
              </Navlink>
              <Navlink to="/cart">
                <ShoppingCartOutlined
                  sx={{ color: "inherit", fontSize: "28px" }}
                />
              </Navlink>
              <Avatar
                src={currentUser?.img}
                sx={{
                  color: "inherit",
                  fontSize: "28px",
                }}
              >
                {currentUser?.name[0]}
              </Avatar>
            </>
          ) : (
            <Button
              text="SignIn"
              small
              onClick={() => setOpenAuth(!openAuth)}
            />
          )}
        </Mobileicons>

        <ButtonContainer>
          <Navlink to="/search">
            <SearchRounded sx={{ color: "inherit", fontSize: "30px" }} />
          </Navlink>

          {currentUser ? (
            <>
              <Navlink to="/favorite">
                <FavoriteBorder sx={{ color: "inherit", fontSize: "28px" }} />
              </Navlink>
              <Navlink to="/cart">
                <ShoppingCartOutlined
                  sx={{ color: "inherit", fontSize: "28px" }}
                />
              </Navlink>
              <Avatar
                src={currentUser?.img}
                sx={{
                  color: "inherit",
                  fontSize: "28px",
                }}
              >
                {currentUser?.name[0]}
              </Avatar>
              
              {/* Theme Switcher Button */}
              <ThemeSwitcherContainer className="theme-switcher-container">
                <ThemeButton onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}>
                  {theme === 'dark' ? (
                    <DarkMode fontSize="medium" />
                  ) : theme === 'light' ? (
                    <LightMode fontSize="medium" />
                  ) : (
                    <SettingsBrightness fontSize="medium" />
                  )}
                </ThemeButton>
                
                <ThemeDropdown $isOpen={isThemeMenuOpen}>
                  <ThemeOption onClick={() => handleThemeChange('light')}>
                    <LightMode /> Light Mode
                  </ThemeOption>
                  <ThemeOption onClick={() => handleThemeChange('dark')}>
                    <DarkMode /> Dark Mode
                  </ThemeOption>
                  <ThemeOption onClick={() => handleThemeChange('system')}>
                    <SettingsBrightness /> System Preference
                  </ThemeOption>
                </ThemeDropdown>
              </ThemeSwitcherContainer>
              
              <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
            </>
          ) : (
            <>
              <ThemeSwitcherContainer className="theme-switcher-container">
                <ThemeButton onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}>
                  {theme === 'dark' ? (
                    <DarkMode fontSize="medium" />
                  ) : theme === 'light' ? (
                    <LightMode fontSize="medium" />
                  ) : (
                    <SettingsBrightness fontSize="medium" />
                  )}
                </ThemeButton>
                
                <ThemeDropdown $isOpen={isThemeMenuOpen}>
                  <ThemeOption onClick={() => handleThemeChange('light')}>
                    <LightMode /> Light Mode
                  </ThemeOption>
                  <ThemeOption onClick={() => handleThemeChange('dark')}>
                    <DarkMode /> Dark Mode
                  </ThemeOption>
                  <ThemeOption onClick={() => handleThemeChange('system')}>
                    <SettingsBrightness /> System Preference
                  </ThemeOption>
                </ThemeDropdown>
              </ThemeSwitcherContainer>
              
              <Button
                text="SignIn"
                small
                onClick={() => setOpenAuth(!openAuth)}
              />
            </>
          )}
        </ButtonContainer>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;