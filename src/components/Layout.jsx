import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Yeh sabse zaroori cheez hai
import Sidebar from './Sidebar';
import Header from './Header';
// import Footer from './Footer'; // Agar footer zaroori hai toh

const drawerWidth = 240; // Sidebar ki width

const Layout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* 1. Header (Top Bar) */}
            <Header drawerWidth={drawerWidth} />

            {/* 2. Sidebar (Navigation) */}
            <Sidebar drawerWidth={drawerWidth} />

            {/* 3. Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: '#f4f6f8',
                    minHeight: '100vh'
                }}
            >
                <Toolbar /> {/* Yeh space banane ke liye hai taake content header ke neeche na dabe */}
                
                {/* Outlet ka matlab hai ke Dashboard, Bookings waghaira yahan render honge */}
                <Outlet /> 
                
                {/* <Footer /> */}
            </Box>
        </Box>
    );
};

export default Layout;