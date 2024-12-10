import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}
/**
 * Filter modal 
 * @author Neethu
 */
const FilterDialog: React.FC<FilterDialogProps> = ({ open, onClose, onApplyFilters }) => {
  const { control, handleSubmit, reset, setValue , formState: { errors } } = useForm();

  //On apply button click
  const onSubmit = (data: any) => {
    onApplyFilters(data);
    onClose(); // Close the dialog after applying filters
  };

  /**
   * fuction to reset the filter fields
   */
  const handleReset = () => {
    reset();
    setValue("startDate", "");
    setValue("endDate", "");
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
        <Grid container justifyContent={'space-between'}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton></Grid>
      </DialogTitle>

      <DialogContent >
        <Grid container spacing={2} className='custom-list-filters'>
          {/* Start Date Field */}
          <Grid size={{ xs: 6 }}  >
            <Controller
              name="startDate"
              control={control}
              rules={{
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}$/, // Date format validation: YYYY-MM-DD
                  message: "Please enter a valid start date (DD-MM-YYYY)"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Start Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  error={!!errors.startDate}
                  helperText={errors.startDate ? "Please enter a valid start date" : ''}
                />
              )}
            />
          </Grid>

          {/* End Date Field */}
          <Grid size={{ xs: 6 }}  >
            <Controller
              name="endDate"
              control={control}
              rules={{
                pattern: {
                  value: /^\d{4}-\d{2}-\d{2}$/, // Date format validation: YYYY-MM-DD
                  message: "Please enter a valid end date (DD-MM-YYYY)"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="End Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  error={!!errors.endDate}
                  helperText={errors.endDate ? "Please enter a valid end date" : ''}
                />
              )}
            />
          </Grid>

          {/* Discount Type Field */}
          
        </Grid>
      </DialogContent>

      <DialogActions>
        <Grid size={{ xs: 4 }}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className="custom-list-filter-btn"
            onClick={handleReset}
          >
            RESET
          </Button>
        </Grid>
        <Button onClick={handleSubmit(onSubmit)} className="custom-list-next-btn" variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
