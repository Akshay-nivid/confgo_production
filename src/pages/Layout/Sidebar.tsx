import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";

import {
  CalenderIcon,
  CouponIcon,
  EventIcon,
  DashboardIcon,
} from "@/assets/svg";

interface SidebarProps {
  open: boolean;
}

const sidebarItems = [
  {
    path: "/",
    icon: DashboardIcon,
    label: "Dashboard",
    exact: true,
  },
  {
    path: "/events",
    icon: EventIcon,
    label: "Events",
    exact: false,
  },
  {
    path: "/coupon",
    icon: CouponIcon,
    label: "Coupon",
    exact: false,
  },
  {
    path: "/calendar",
    icon: CalenderIcon,
    label: "Calendar",
    exact: false,
  },
];

/**
 * Component used to render sidebar
 * @returns
 */
const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return path === location.pathname;
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      className="sidebar-drawer"
    >
      <div className="px-[1.666rem] flex-1">
        <p className="text-start list-header">MENU</p>
        <List className="sidebar-list">
          {sidebarItems.map((item) => {
            const isActive = isActiveLink(item.path);
            return (
              <NavLink to={item.path} key={item.path}>
                <ListItem>
                  <ListItemButton>
                    <item.icon
                      className={
                        isActive ? "sidebar-list-active-drawer-icon" : ""
                      }
                    />
                    <ListItemText>{item.label}</ListItemText>
                  </ListItemButton>
                </ListItem>
              </NavLink>
            );
          })}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
