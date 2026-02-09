import React from 'react';
import {
    Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Toolbar, Typography, Box
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    LocalShipping as BookingIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Divider } from '@mui/material';

const Sidebar = ({ drawerWidth }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Yeh check karne ke liye ke hum kis page par hain

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
        { text: 'Bookings', icon: <BookingIcon />, path: '/bookings' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff', // Professional Dark Blue/Grey
                    color: 'hsla(0, 2%, 17%, 1.00)'
                },
            }}
        >
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#38bdf8' }}>
                    IB LOGISTICS
                </Typography>


            </Toolbar>

            {/* 2. YAHAN LAGAIEN DIVIDER */}
            <Divider sx={{
                mx: 2,           // Line ko dono sides se thora andar karne ke liye
                mb: 1,           // Niche menu se thora gap dene ke liye
                backgroundColor: '#e2e8f0', // Line ka halka sa color
                height: '1px'    // Line ki thickness
            }} />

            <Box sx={{ overflow: 'auto', mt: 2 }}>
                <List>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: 'initial',
                                        px: 2.5,
                                        mx: 1,
                                        borderRadius: '8px',
                                        mb: 1,
                                        // Active link styling
                                        backgroundColor: isActive ? 'primary.main' : 'transparent',
                                        color: isActive ? '#ffffff !important' : '#64748b',
                                        '&:hover': {
                                            backgroundColor: isActive ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: 3,
                                            justifyContent: 'center',
                                            color: isActive ? '#ffffff' : '#94a3b8',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            opacity: 1,
                                            '& .MuiTypography-root': {
                                                fontWeight: isActive ? 600 : 400,
                                                fontSize: '0.9rem'
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;