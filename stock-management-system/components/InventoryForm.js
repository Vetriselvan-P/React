import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Paper, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton } from '@mui/material';
import { AddCircle, Update, Inventory, Edit, Delete } from '@mui/icons-material';

const apiUrl = 'http://localhost:3001/items'; // Replace this with your actual API endpoint

const InventoryForm = () => {
    const [item, setItem] = useState({ name: '', quantity: '', price: '', category: '' });
    const [isUpdate, setIsUpdate] = useState(false);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Fetch items from the server (GET request)
    useEffect(() => {
        axios.get(apiUrl)
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the items!", error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    };

    // Add new item (POST request)
   // Add new item (POST request)
const handleAddItem = () => {
    axios.post(apiUrl, { ...item }) // No need to set id here
        .then(response => {
            setItems([...items, response.data]);
            setItem({ name: '', quantity: '', price: '', category: '' });
        })
        .catch(error => {
            console.error("There was an error adding the item!", error);
        });
};


    // Update an item (PUT request)
    const handleUpdateItem = () => {
        axios.put(`${apiUrl}/${item.id}`, item)
            .then(() => {
                setItems(items.map(i => i.id === item.id ? item : i));
                setItem({ name: '', quantity: '', price: '', category: '' });
                setIsUpdate(false);
            })
            .catch(error => {
                console.error("There was an error updating the item!", error.response.data); // log the response data
            });
    };

    const handleEditClick = (item) => {
        setItem(item);
        setIsUpdate(true);
    };

    // Delete an item (DELETE request)
    const handleDeleteClick = (id) => {
        console.log("Attempting to delete item with ID:", id); // Log the ID to be deleted
        if (!id) {
            console.error("No ID provided for deletion.");
            return; // Prevent deletion if ID is undefined
        }
    
        axios.delete(`${apiUrl}/${id}`)
            .then(() => {
                setItems(items.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error("There was an error deleting the item!", error.response ? error.response.data : error);
            });
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    return (
        <Paper elevation={3} style={{ padding: '30px', maxWidth: '1000px', margin: 'auto', backgroundColor: '#f7f7f7' }}>
            <Typography variant="h5" gutterBottom>
                <Inventory fontSize="large" /> {isUpdate ? 'Update Item' : 'Add New Item'}
            </Typography>
            <Stack spacing={2} mb={4}>
                <TextField 
                    name="name" 
                    label="Item Name" 
                    variant="outlined" 
                    fullWidth 
                    value={item.name} 
                    onChange={handleInputChange} 
                />
                <TextField 
                    name="quantity" 
                    label="Quantity" 
                    variant="outlined" 
                    fullWidth 
                    type="number" 
                    value={item.quantity} 
                    onChange={handleInputChange} 
                />
                <TextField 
                    name="price" 
                    label="Price" 
                    variant="outlined" 
                    fullWidth 
                    type="number" 
                    value={item.price} 
                    onChange={handleInputChange} 
                />
                <TextField 
                    name="category" 
                    label="Category" 
                    variant="outlined" 
                    fullWidth 
                    value={item.category} 
                    onChange={handleInputChange} 
                />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircle />}
                            onClick={handleAddItem}
                            disabled={isUpdate}
                            fullWidth
                        >
                            Add Item
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Update />}
                            onClick={handleUpdateItem}
                            disabled={!isUpdate}
                            fullWidth
                        >
                            Update Item
                        </Button>
                    </Grid>
                </Grid>
            </Stack>

            <Typography variant="h6" gutterBottom>
                Inventory List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(item)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(item.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={items.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default InventoryForm;
