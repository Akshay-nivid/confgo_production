import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Typography, Select, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ open, onClose, onApplyFilters }) => {
  const { control, handleSubmit } = useForm();

  //On apply button click
  const onSubmit = (data: any) => {
    onApplyFilters(data);
    onClose(); // Close the dialog after applying filters
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{

      }}
      hideBackdrop
    >
      <DialogTitle >
        <Typography variant="h6">Filters</Typography>
      </DialogTitle>

      <DialogContent >
        <Grid container spacing={2} className='custom-list-filters'>
          {/* Start Date Field */}
          <Grid item xs={6}  >
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Start Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* End Date Field */}
          <Grid item xs={6}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="End Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Discount Type Field */}
          
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} className="custom-list-filter-btn">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)}   className="custom-list-next-btn" variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
