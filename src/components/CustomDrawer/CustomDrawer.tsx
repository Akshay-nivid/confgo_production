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
  className?: string
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ open, onClose, children, type, className }) => {
  return (
    <Drawer anchor={type} open={open} onClose={onClose} className={className}>
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
