import React from "react";
import { Modal, Box } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box border={"none"}>
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
