import styled from "styled-components";
import { COLORS } from "../../themes/themes";

export const FormBtn = styled.button`
  border-radius: 4px;
  background: ${COLORS.vtbBtnColor};
  padding: 10px 22px;
  width: ${({ width }) => (width ? width : "100%")};
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  outline: none;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: ${({ marginLeft }) => (marginLeft ? marginLeft : "0px")};
  align-items: center;
  justify-content: center;
  display: flex;
  font-family: "Montserrat", sans-serif;
  opacity: ${({ disabled, $opacity }) =>
    disabled ? 0.5 : $opacity ? 0.25 : 1};

  @media screen and (max-width: 768px) {
    width: ${({ mobileWidth }) => (mobileWidth ? mobileWidth : "100%")};
    margin-left: ${({ mobileMarginLeft }) =>
      mobileMarginLeft ? mobileMarginLeft : "0"};
  }
`;

export const TransparentFormBtn = styled.button`
  border-radius: 4px;
  background: transparent;
  padding: 10px 22px;
  width: ${({ width }) => (width ? width : "100%")};
  color: ${({ color }) => (color ? COLORS.vtbBtnColor : COLORS.vtbBtnColor)};
  font-size: 18;
  font-weight: 600;
  border: 2px solid ${COLORS.vtbBtnColor};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: ${({ marginLeft }) => (marginLeft ? marginLeft : "0px")};
  align-items: center;
  justify-content: center;
  align-content: center;
  display: flex;
  font-family: "Montserrat", sans-serif;

  &:hover {
    transition: all 0.2s ease-in-out;
    color: ${({ hoverColor }) =>
      hoverColor ? COLORS.vtbBtnColor : COLORS.vtbBtnColor};
    border: 2px solid #ccc;
  }

  @media screen and (max-width: 768px) {
    width: ${({ mobileWidth }) => (mobileWidth ? mobileWidth : "100%")};
    margin-left: ${({ mobileMarginLeft }) =>
      mobileMarginLeft ? mobileMarginLeft : "0"};
  }
`;
