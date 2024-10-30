/**
 *  CustomDrawer.tsx
 *  This component handles the launching of the drawer
 */
import React from 'react';
import { Drawer } from '@mui/material';

interface CustomDrawerProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode; 
  type: 'left' | 'right' | 'top' | 'bottom';
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ open, onClose, children, type }) => {
  return (
    <Drawer anchor={type} open={open} onClose={onClose}>
      <div
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        {children} 
      </div>
    </Drawer>
  );
};

export default CustomDrawer;
