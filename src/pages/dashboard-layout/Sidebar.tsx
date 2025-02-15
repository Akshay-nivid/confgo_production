import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import AppLogo from "@/assets/app-logo.png"
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,

} from '@mui/material';

import {
  CalenderIcon,
  CouponIcon,
  EventIcon,
  DashboardIcon,
  UserCreateIcon,
} from '@/assets/svg';
import routes from '@/router/routes';
import { clearDataById } from '@/Libs/store';

import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import Grid from "@mui/material/Grid2";

interface SidebarProps {
  open: boolean;
}

const sidebarItems = [
  {
    path: routes.dashboard(),
    icon: DashboardIcon,
    id:'sidebar-dashboard-button',
    label: 'Dashboard',
    exact: true,
  },
  {
    path: routes.events(),
    icon: EventIcon,
    id:'sidebar-event-button',
    label: 'Events',
    exact: false,
  },
  {
    path: routes.coupon(),
    icon: CouponIcon,
    id: 'sidebar-coupon-button',
    label: 'Coupon',
    exact: false,
  },
  {
    path:routes.users(),
    icon:UserCreateIcon,
    id:'sidebar-user-button',
    label:'Users',
    exact:false

  },
  {
    path: routes.sponsor(),
    icon: HandshakeOutlinedIcon,
    id:'sidebar-sponsor-button',
    label: 'Sponsors',
    exact: false,
  },
  {
    path:routes.adminPayment(),
    icon:PaymentIcon,
    id:'sidebar-payment-button',
    label:'Payment',
    exact:false
  },
  {
    path: routes.calendar(),
    icon: CalenderIcon,
    id:'sidebar-calender-button',
    label: 'Calendar',
    exact: false,
  },

];

/**
 * Component used to render sidebar
 * @returns
 */
const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  /**
   * clear the tabValue deafult value is one
   */
  useEffect(() => {
    clearDataById("tabValue");
  });
  const location = useLocation();
  const isActiveLink = (path: string, exact: boolean) => {
    const isActive = exact
      ? path === location.pathname
      : location.pathname.startsWith(path);
    return isActive;
  };




  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      className="sidebar-drawer-admin"
    >
      <div className="content flex flex-col items-center">
        <Grid className="logo-container">
        
          <img src={AppLogo} className="logo" alt="" />
        </Grid>
        <List className="sidebar-list-admin">
          {sidebarItems.map((item) => {
            const isActive = isActiveLink(item.path, item.exact);

            return (
              <NavLink to={item.path} key={item.path} id={item.id}>
                <ListItem>
                  <ListItemButton>
                    <item.icon
                      className={
                        isActive ? 'sidebar-list-admin-active-drawer-icon-admin' : ''
                      }
                    />

                    <ListItemText className='link-item'>{item.label}</ListItemText>
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

