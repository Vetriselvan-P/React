import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import ReactToPrint from 'react-to-print';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const printRef = useRef();

    // Fetch data from API
    useEffect(() => {
        axios.get('http://localhost:3001/items')
            .then(response => {
                const fetchedData = response.data;

                // Map data for Bar and Pie Charts
                const barChartData = fetchedData.map(item => ({
                    name: item.name,
                    value: Number(item.quantity) || 0 // Ensure it's a number
                }));

                const pieChartData = fetchedData.map(item => ({
                    name: item.category,
                    value: Number(item.quantity) || 0 // Ensure it's a number
                }));

                setBarData(barChartData);
                setPieData(pieChartData);
                console.log('Bar Data:', barChartData); // Check the barData structure
                console.log('Pie Data:', pieChartData); // Check the pieData structure
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Function to download CSV
    const downloadCSV = () => {
        const csv = Papa.unparse({
            fields: ['Name', 'Value'],
            data: barData.map(item => [item.name, item.value])
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'report.csv');
    };

    return (
        <Box padding={4}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Stock Management Reports
            </Typography>
            
            <Stack spacing={4} alignItems="center">
                <Paper elevation={3} style={{ padding: '20px', width: '100%', maxWidth: '600px' }}>
                    <Typography variant="h6" gutterBottom>
                        Stock Levels Bar Graph
                    </Typography>
                    {barData.length > 0 && barData.some(data => data.value > 0) ? (
                    <BarChart
                        width={500}
                        height={300}
                        data={barData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                    ):(
                        <Typography>No data available for the Bar Chart</Typography>
                    )}
                </Paper>

                <Paper elevation={3} style={{ padding: '20px', width: '100%', maxWidth: '600px' }}>
                    <Typography variant="h6" gutterBottom>
                        Inventory Distribution Pie Chart
                    </Typography>
                    {pieData.length > 0 && pieData.some(data => data.value > 0) ? (
                        <PieChart width={1000} height={400}>
                            <Pie
                                data={pieData}
                                cx={285}
                                cy={200}
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={75}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    ) : (
                       <Typography>No data available for the Pie Chart</Typography>
                    )} 
                </Paper>

                <Stack spacing={2} direction="row">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={downloadCSV} 
                        style={{ marginTop: '20px', fontSize: '16px' }} // Adjusted font size
                    >
                        Download CSV
                    </Button>
                    <ReactToPrint
                        trigger={() => (
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                style={{ marginTop: '20px', fontSize: '16px' }} // Adjusted font size
                            >
                                Download PDF
                            </Button>
                        )}
                        content={() => printRef.current}
                    />
                </Stack>
            </Stack>

            <div ref={printRef} style={{ display: 'none' }}>
                <Typography variant="h4" gutterBottom>
                    Stock Management Report
                </Typography>
                <BarChart
                    width={500}
                    height={300}
                    data={barData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
                <PieChart width={400} height={400}>
                    <Pie
                        data={pieData}
                        cx={200}
                        cy={200}
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>
        </Box>
    );
};

export default Reports;
