import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button, TextField, Container, Typography, Grid, MenuItem, FormControl, InputLabel, Select, Card, CardContent, CardActions } from '@mui/material';
import CustomAppBar from '../components/AppBar';
import Sidebar from '../components/Sidebar';

const eventTypes = ['online', 'offline', 'hybrid'];
const roles = ['main', 'sub-event'];

const EventManagment: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [eventType, setEventType] = React.useState<string>('');
  const [role, setRole] = React.useState<string>('');
  const { control, handleSubmit, reset, setValue } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subEvents'
  });

/*
 * Handles the submission of the form data.
 * 
 * The `data` parameter is an object containing the form data.
 */
const onSubmit = (data: object) => {
  const payload = {
    ...data,
    eventType,
    role
  };
  
  console.log('Payload:', payload);
};

/*
 * Clears the form and resets state variables.
 * 
 * This function performs the following actions:
 * - Resets the form using the `reset` function (likely from a form library).
 * - Sets the `eventType` state to an empty string.
 * - Sets the `role` state to an empty string.
 */
const handleClear = () => {
  reset();
  setEventType('');
  setRole('');
};

/*
 * Adds a new sub-event to the list.
 * 
 * This function creates a new sub-event with empty or default values for
 * all properties and appends it to a collection of sub-events. This is
 * typically used for initializing a new entry in a form or list.
 */
const handleAddSubEvent = () => {
  append({
    id: '',
    parentId: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    venueId: '',
    interval: '',
    companyId: '',
    title: '',
    amount: '',
    discount: ''
  });
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CustomAppBar sidebarOpen={sidebarOpen} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: 64 }}>
        <Sidebar open={sidebarOpen} />
        <Container style={{ flexGrow: 1, padding: '20px', marginLeft: sidebarOpen ? 24 : 0 }}>
          <Typography variant="h5" gutterBottom>
            Event Management
          </Typography>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  {/* Main Event Fields */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="id"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="ID" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="parentId"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="Parent ID" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="Name" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="Description" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="Start Date" 
                          type="date" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                          InputLabelProps={{ shrink: true }} 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="End Date" 
                          type="date" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                          InputLabelProps={{ shrink: true }} 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="venueId"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="Venue ID" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Event Type</InputLabel>
                      <Controller
                        name="eventType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Event Type"
                            onChange={(e) => {
                              setValue('eventType', e.target.value as string);
                              setEventType(e.target.value as string);
                            }}
                          >
                            {eventTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Role</InputLabel>
                      <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Role"
                            onChange={(e) => {
                              setValue('role', e.target.value as string);
                              setRole(e.target.value as string);
                            }}
                          >
                            {roles.map((roleItem) => (
                              <MenuItem key={roleItem} value={roleItem}>
                                {roleItem.charAt(0).toUpperCase() + roleItem.slice(1)}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="interval"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="Interval" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="companyId"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="Company ID" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="Title" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="Amount" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name="discount"
                      control={control}
                      render={({ field }) => (
                        <TextField 
                          label="Discount" 
                          variant="outlined" 
                          margin="normal" 
                          fullWidth 
                          {...field} 
                          required 
                        />
                      )}
                    />
                  </Grid>

                  {/* Conditionally Render Sub Events Section */}
                  {fields.map((field, index) => (
                    <Grid item xs={12} key={field.id}>
                      <Card style={{ position: 'relative', marginBottom: 20 }}>
                        <CardContent>
                          <div style={{ position: 'relative' }}>
                            <Button
                              variant="contained"
                              color="secondary"
                              style={{ position: 'absolute', top: 10, right: 10 }}
                              onClick={() => remove(index)}
                            >
                              Remove Sub Event
                            </Button>
                            <Typography variant="h6">Sub Event #{index + 1}</Typography>
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.id`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="ID"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.parentId`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="Parent ID"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.name`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="Name"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.description`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="Description"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.startDate`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="Start Date"
                                      type="date"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.endDate`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="End Date"
                                      type="date"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.venueId`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="Venue ID"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.interval`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="Interval"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.companyId`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="Company ID"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.title`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="Title"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.amount`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="Amount"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                  name={`subEvents.${index}.discount`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      label="Discount"
                                      variant="outlined"
                                      margin="normal"
                                      fullWidth
                                      {...field}
                                      required
                                    />
                                  )}
                                />
                              </Grid>
                            </Grid>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleAddSubEvent}
                    >
                      Add Sub Event
                    </Button>
                  </Grid>
                </Grid>
                <CardActions style={{ justifyContent: 'flex-end' }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    style={{ marginRight: 10 }}
                  >
                    Submit
                  </Button>
                  <Button 
                    type="button" 
                    variant="contained" 
                    color="secondary"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </CardActions>
              </form>
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default EventManagment;
