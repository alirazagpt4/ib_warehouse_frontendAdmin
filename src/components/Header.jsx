import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Avatar } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon, Notifications } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Header = ({ drawerWidth }) => {
    const { logout } = useContext(AuthContext);

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                backgroundColor: '#ffffff', // Clean white look
                color: '#333', // Dark text for contrast
                boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)', // Subtle shadow
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Mobile Menu Icon (Sirf mobile par nazar ayega) */}
                <IconButton
                    color="inherit"
                    edge="start"
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Dashboard Title */}
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                    Admin Portal
                </Typography>

                {/* Right Side Icons & Profile */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton color="inherit">
                        <Notifications fontSize="small" />
                    </IconButton>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', mr: 1, fontSize: '0.9rem' }}>
                            A
                        </Avatar>
                        <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 500 }}>
                            Admin User
                        </Typography>
                    </Box>

                    <Button 
                        onClick={logout}
                        startIcon={<LogoutIcon />} 
                        color="error" 
                        size="small"
                        sx={{ textTransform: 'none' }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;