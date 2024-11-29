import React, { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, Tooltip } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import OrderIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import styled from '@emotion/styled';
import axios from 'axios';

const CardContainer = styled(Paper)`
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  color: white;
  border-radius: 15px;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  }
`;

const DashboardContainer = styled(Box)`
  padding: 40px;
`;

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalItems: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    upcomingDeliveries: 0,
    recentlyAdded: [],
    stockAlerts: []
  });

  useEffect(() => {
    // Fetch inventory data
    axios.get('http://localhost:3001/items')
      .then(response => {
        const items = response.data;
        const lowStockItems = items.filter(item => item.quantity < 10);
        const recentlyAdded = items.slice(-5); // Show last 5 items added
        
        setDashboardData(prevData => ({
          ...prevData,
          totalItems: items.length,
          lowStockItems: lowStockItems.length,
          recentlyAdded,
          stockAlerts: lowStockItems
        }));
      })
      .catch(error => {
        console.error('Error fetching inventory data:', error);
      });

    // Generate a random number for pending orders (for example, between 1 and 50)
    const randomPendingOrders = Math.floor(Math.random() * 50) + 1;
    setDashboardData(prevData => ({
      ...prevData,
      pendingOrders: randomPendingOrders
    }));

    // Random values for upcoming deliveries
    const randomUpcomingDeliveries = Math.floor(Math.random() * 10 + 20); // Random number between 20 and 50
    setDashboardData(prevData => ({
      ...prevData,
      upcomingDeliveries: randomUpcomingDeliveries
    }));
  }, []);

  return (
    <DashboardContainer>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>
        Stock Management Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Tooltip title="Total number of items currently in stock">
            <CardContainer elevation={3}>
              <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Total Items</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <InventoryIcon sx={{ fontSize: 40, color: '#3f51b5', mr: 2 }} />
                <Typography variant="h3" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {dashboardData.totalItems}
                </Typography>
              </Box>
              <Typography sx={{ mt: 2 }}>
                This is the total count of items currently available in the warehouse.
              </Typography>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={4}>
          <Tooltip title="Items that need immediate restocking">
            <CardContainer elevation={3}>
              <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Low Stock Items</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <LowPriorityIcon sx={{ fontSize: 40, color: '#f44336', mr: 2 }} />
                <Typography variant="h3" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {dashboardData.lowStockItems}
                </Typography>
              </Box>
              <Typography sx={{ mt: 2 }}>
                These items are running low and need to be restocked soon.
              </Typography>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={4}>
          <Tooltip title="Orders that have not yet been fulfilled">
            <CardContainer elevation={3}>
              <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Pending Orders</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <OrderIcon sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
                <Typography variant="h3" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {dashboardData.pendingOrders}
                </Typography>
              </Box>
              <Typography sx={{ mt: 2 }}>
                These are orders that have been placed but are yet to be fulfilled.
              </Typography>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={4}>
          <Tooltip title="Items scheduled for delivery soon">
            <CardContainer elevation={3}>
              <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Upcoming Deliveries</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <LocalShippingIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                <Typography variant="h3" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {dashboardData.upcomingDeliveries}
                </Typography>
              </Box>
              <Typography sx={{ mt: 2 }}>
                Deliveries expected within the next few days.
              </Typography>
            </CardContainer>
          </Tooltip>
        </Grid>

        <Grid item xs={12} md={4}>
          <CardContainer elevation={3}>
            <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Recently Added Items</Typography>
            <Box sx={{ mt: 2 }}>
              {dashboardData.recentlyAdded.map((item, index) => (
                <Typography key={index} variant="body1" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                  • {item.name} - {item.quantity} units
                </Typography>
              ))}
            </Box>
          </CardContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <CardContainer elevation={3}>
            <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Stock Alerts</Typography>
            <Box sx={{ mt: 2 }}>
              {dashboardData.stockAlerts.map((alert, index) => (
                <Typography key={index} variant="body1" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                  • {alert.name} - {alert.quantity} units left
                </Typography>
              ))}
            </Box>
          </CardContainer>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
}

export default Dashboard;
