import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ small }) => (small ? "10px 16px" : "12px 24px")};
  border-radius: ${({ theme }) => theme.radii.medium};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  user-select: none;
  width: ${({ full }) => (full ? "100%" : "auto")};

  ${({ type = "primary", outlined, theme }) => {
    const colors = {
      primary: {
        bg: theme.colors.primary,
        text: theme.colors.buttonText,
        border: theme.colors.primary,
      },
      secondary: {
        bg: theme.colors.secondary,
        text: theme.colors.buttonText,
        border: theme.colors.secondary,
      },
    };
    const current = colors[type];

    return `
      background-color: ${outlined ? "transparent" : current.bg};
      color: ${outlined ? current.bg : current.text};
      border-color: ${current.border};

      &:hover {
        background-color: ${
          outlined
            ? `${current.bg}1A`
            : `color-mix(in srgb, ${current.bg}, #000 10%)`
        };
        border-color: ${
          outlined
            ? current.border
            : `color-mix(in srgb, ${current.bg}, #000 10%)`
        };
      }
    `;
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button = ({
  text,
  isLoading,
  isDisabled,
  rightIcon,
  leftIcon,
  type = "primary",
  onClick,
  full,
  small,
  outlined,
}) => {
  const disabled = isLoading || isDisabled;

  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      type={type}
      full={full}
      small={small}
      outlined={outlined}
    >
      {isLoading && <CircularProgress size={20} color="inherit" />}
      {!isLoading && leftIcon}
      <span>{text}</span>
      {!isLoading && rightIcon}
    </StyledButton>
  );
};

export default Button;