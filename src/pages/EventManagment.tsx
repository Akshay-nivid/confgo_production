import React from 'react';
import { Button, TextField, Container, Typography, Grid, MenuItem, FormControl, InputLabel, Select, Card, CardContent, CardActions } from '@mui/material';
import CustomAppBar from '../components/AppBar';
import Sidebar from '../components/Sidebar';

const eventTypes = ['online', 'offline', 'hybrid'];
const roles = ['main', 'sub-event'];

const EventManagment: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [eventType, setEventType] = React.useState<string>('');
  const [role, setRole] = React.useState<string>('');
  const [formData, setFormData] = React.useState({
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
  const [subEvents, setSubEvents] = React.useState<Array<typeof formData>>([]);
  const [showSubEvents, setShowSubEvents] = React.useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    if (index !== undefined) {
      const updatedSubEvents = [...subEvents];
      updatedSubEvents[index] = {
        ...updatedSubEvents[index],
        [e.target.name]: e.target.value
      };
      setSubEvents(updatedSubEvents);
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Construct payload for API call
    const payload = {
      ...formData,
      eventType,
      role,
      subEvents
    };
    
    console.log('Payload:', payload);
  };

  const handleClear = () => {
    setFormData({
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
    setEventType('');
    setRole('');
    setSubEvents([]);
    setShowSubEvents(false); // Hide sub-event forms on clear
  };

  const handleAddSubEvent = () => {
    setShowSubEvents(true);
    setSubEvents([...subEvents, {
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
    }]);
  };

  const handleRemoveSubEvent = (index: number) => {
    const updatedSubEvents = subEvents.filter((_, i) => i !== index);
    setSubEvents(updatedSubEvents);
    if (updatedSubEvents.length === 0) {
      setShowSubEvents(false); // Hide sub-event forms if none remain
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CustomAppBar sidebarOpen={sidebarOpen} onSidebarToggle={handleSidebarToggle} />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: 64 }}>
        <Sidebar open={sidebarOpen} />
        <Container style={{ flexGrow: 1, padding: '20px', marginLeft: sidebarOpen ? 24 : 0 }}>
          <Typography variant="h5" gutterBottom>
            Event Management
          </Typography>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Main Event Fields */}
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="ID" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="Parent ID" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="parentId"
                      value={formData.parentId}
                      onChange={handleChange}
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="Name" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="Description" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="Start Date" 
                      type="date" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required 
                      InputLabelProps={{ shrink: true }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="End Date" 
                      type="date" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required 
                      InputLabelProps={{ shrink: true }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="Venue ID" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="venueId"
                      value={formData.venueId}
                      onChange={handleChange}
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Event Type</InputLabel>
                      <Select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as string)}
                        label="Event Type"
                      >
                        {eventTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value as string)}
                        label="Role"
                      >
                        {roles.map((roleItem) => (
                          <MenuItem key={roleItem} value={roleItem}>
                            {roleItem.charAt(0).toUpperCase() + roleItem.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="Interval" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="interval"
                      value={formData.interval}
                      onChange={handleChange}
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="Company ID" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleChange}
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="Title" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="Amount" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      label="Discount" 
                      variant="outlined" 
                      margin="normal" 
                      fullWidth 
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      required 
                    />
                  </Grid>

                  {/* Conditionally Render Sub Events Section */}
                  {showSubEvents && subEvents.map((subEvent, index) => (
                    <Grid item xs={12} key={index}>
                      <Card style={{ position: 'relative', marginBottom: 20 }}>
                        <CardContent>
                          <div style={{ position: 'relative' }}>
                            <Button
                              variant="contained"
                              color="secondary"
                              style={{ position: 'absolute', top: 10, right: 10 }}
                              onClick={() => handleRemoveSubEvent(index)}
                            >
                              Remove Sub Event
                            </Button>
                            <Typography variant="h6">Sub Event #{index + 1}</Typography>
                            <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="ID"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="id"
                              value={subEvent.id}
                              onChange={(e) => handleChange(e, index)}
                              required
                            />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Parent ID"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="parentId"
                              value={subEvent.parentId}
                              onChange={(e) => handleChange(e, index)}
                              required
                            />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Name"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="name"
                              value={subEvent.name}
                              onChange={(e) => handleChange(e, index)}
                              required
                            /></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Description"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="description"
                              value={subEvent.description}
                              onChange={(e) => handleChange(e, index)}
                              required
                            /></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Start Date"
                              type="date"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="startDate"
                              value={subEvent.startDate}
                              onChange={(e) => handleChange(e, index)}
                              required
                              InputLabelProps={{ shrink: true }}
                            /></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="End Date"
                              type="date"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="endDate"
                              value={subEvent.endDate}
                              onChange={(e) => handleChange(e, index)}
                              required
                              InputLabelProps={{ shrink: true }}
                            /></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Venue ID"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="venueId"
                              value={subEvent.venueId}
                              onChange={(e) => handleChange(e, index)}
                              required
                            /></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Interval"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="interval"
                              value={subEvent.interval}
                              onChange={(e) => handleChange(e, index)}
                              required
                            /></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Company ID"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="companyId"
                              value={subEvent.companyId}
                              onChange={(e) => handleChange(e, index)}
                              required
                            /></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Title"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="title"
                              value={subEvent.title}
                              onChange={(e) => handleChange(e, index)}
                              required
                            /></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Amount"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="amount"
                              value={subEvent.amount}
                              onChange={(e) => handleChange(e, index)}
                              required
                            /></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Discount"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              name="discount"
                              value={subEvent.discount}
                              onChange={(e) => handleChange(e, index)}
                              required
                            /></Grid>
                            </Grid>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  <Grid item xs={12} >
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
