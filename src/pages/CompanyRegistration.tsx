import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Avatar, MenuItem, Select, FormControl, InputLabel, Card, CardContent } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Sidebar from './Layout/Sidebar';


// List of Indian states
const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const CompanyRegistration: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const validateEmail = (value: string) => {
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Invalid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (value: string) => {
    if (!/^\d{10}$/.test(value)) {
      setPhoneError('Invalid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPhone(value);
    validatePhone(value);
  };

  const handleClearForm = () => {
    setEmail('');
    setPhone('');
    setSelectedState('');
    setImage(null);
    setEmailError('');
    setPhoneError('');
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = () => {
    const emailIsValid = validateEmail(email);
    const phoneIsValid = validatePhone(phone);

    if (emailIsValid && phoneIsValid) {
      // const payload = {
      //   email,
      //   phone,
      //   selectedState,
      //   image,
      // };
      // Implement form submission logic here
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CustomAppBar sidebarOpen={sidebarOpen} onSidebarToggle={handleSidebarToggle} />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: 64 }}>
        <Sidebar open={sidebarOpen} />
        <Container style={{ flexGrow: 1, padding: '20px', marginLeft: sidebarOpen ? 24 : 0 }}>
          <Typography variant="h5" gutterBottom>
            Company Registration
          </Typography>
          
          <Card variant="outlined" style={{ marginBottom: '20px' }}>
            <CardContent style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <Avatar
                src={image ? URL.createObjectURL(image) : '/default-avatar.png'}
                alt="Preview"
                style={{ width: 100, height: 100, marginBottom: '20px' }}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                >
                  {image ? 'Change Image' : 'Upload Image'}
                </Button>
              </label>
              {image && (
                <div style={{ marginTop: '10px' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClearImage}
                    startIcon={<DeleteIcon />}
                  >
                    Clear Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <form>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1 1 48%' }}>
                <TextField
                  label="Phone"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  error={!!phoneError}
                  helperText={phoneError}
                  inputProps={{ maxLength: 10 }}
                />
              </div>
              <div style={{ flex: '1 1 48%' }}>
                <TextField
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  required
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  helperText={emailError}
                />
              </div>
              <div style={{ flex: '1 1 48%' }}>
                <TextField label="Company Name" variant="outlined" margin="normal" fullWidth required />
              </div>
              <div style={{ flex: '1 1 48%' }}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel htmlFor="state-select">State</InputLabel>
                  <Select
                    id="state-select"
                    value={selectedState}
                    onChange={(event) => setSelectedState(event.target.value as string)}
                    label="State"
                  >
                    {states.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div style={{ flex: '1 1 48%' }}>
                <TextField
                  label="Company Address"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleClearForm}>
                Clear
              </Button>
            </div>
          </form>
        </Container>
      </div>
    </div>
  );
};

export default CompanyRegistration;
