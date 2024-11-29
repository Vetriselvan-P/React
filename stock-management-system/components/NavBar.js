import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <InventoryIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Stock Management System
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/" startIcon={<DashboardIcon />}>
                        Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/inventory" startIcon={<InventoryIcon />}>
                        Inventory
                    </Button>
                    <Button color="inherit" component={Link} to="/reports" startIcon={<ReportIcon />}>
                        Reports
                    </Button>
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
