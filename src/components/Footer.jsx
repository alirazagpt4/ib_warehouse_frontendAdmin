import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 2,
                px: 2,
                mt: 'auto',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e0e0e0',
                textAlign: 'center'
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary">
                    {'© '}
                    {new Date().getFullYear()}
                    {' '}
                    <Link color="inherit" href="#" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                        IB Warehouse Management System
                    </Link>
                    {'. All rights reserved.'}
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;