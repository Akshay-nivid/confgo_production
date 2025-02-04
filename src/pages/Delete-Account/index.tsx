import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import Grid from "@mui/material/Grid2";

/**
 * Component used to show delete account steps in congo user app
 * @returns 
 */
export const AccountDeletionPage: React.FC<any> = () => {
    return (
        <Container maxWidth="md" className="container">
            <Grid container spacing={3}>
                <Grid size={12}>
                    <Typography variant="h4" className="title">
                        How to Delete Your Account in Confgo
                    </Typography>
                </Grid>
                <Grid size={12}>
                    <Typography className="introduction">
                        At <strong>Confgo</strong>, we value your privacy and provide a simple way to delete your account.
                    </Typography>
                </Grid>
                <Grid size={12} className="steps">
                    <Typography variant="h6">Steps to Delete Your Account:</Typography>
                    <ol>
                        <li>Open the app on your device.</li>
                        <li>Navigate to the <strong>Tabs</strong> section in the bottom navigation bar.</li>
                        <li>Tap on <strong>Profile</strong>.</li>
                        <li>Go to <strong>Account Settings</strong>.</li>
                        <li>Select <strong>Delete Account</strong>.</li>
                    </ol>
                </Grid>
                <Grid size={12} className="important-note">
                    <Typography>
                        <strong>Important:</strong> Once your account is deleted, all your data will be permanently removed.
                    </Typography>
                </Grid>
                <Grid size={12} className="contact">
                    <Typography>
                        For support, contact us at <a href="mailto:support@confgo.com">support@confgo.com</a>.
                    </Typography>
                </Grid>
                <Grid size={12} className="button-container">
                    <Button variant="contained" className="home-button" href="/">
                        Go Back to Home
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};
