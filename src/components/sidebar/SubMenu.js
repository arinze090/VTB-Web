// Filename - components/SubMenu.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { COLORS } from "../../themes/themes";

const SidebarLink = styled(Link)`
  display: flex;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 20px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: #000;
    border-left: 4px solid ${COLORS.vtbBtnColor};
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

// const DropdownLink = styled(Link)`
//   background: #252831;
//   height: 60px;
//   padding-left: 3rem;
//   display: flex;
//   align-items: center;
//   text-decoration: none;
//   color: #f5f5f5;
//   font-size: 18px;

//   &:hover {
//     background: green;
//     cursor: pointer;
//   }
// `;

const SubMenu = ({ item, closeSidebar }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} onClick={closeSidebar}>
        <div
          style={{
            alignContent: "center",
            alignItems: "center",
            // alignSelf: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(item.icon, {
            style: { color: "white" },
          })}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
      </SidebarLink>
    </>
  );
};

export default SubMenu;
