import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TablePagination, TextField,
    InputAdornment, IconButton, Tooltip, CircularProgress, Dialog,
    DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import {
    Add as AddIcon, Search as SearchIcon, Visibility as ViewIcon,
    Edit as EditIcon, Person as PersonIcon
} from '@mui/icons-material';
import API from '../api/axiosInstance';
import { toast } from 'react-toastify';

const Customers = () => {
    // States
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0); // MUI pagination 0-based hoti hai
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // Dialog States
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view'
    const [selectedCustomer, setSelectedCustomer] = useState({
        name: '', phone: '', brandName: '', address: ''
    });

   const fetchCustomers = async () => {
    try {
        setLoading(true);
        // Ensure karein ke URL sahi ban raha hai
        const response = await API.get(`/customers`, {
            params: {
                page: page + 1,
                limit: rowsPerPage,
                search: searchTerm // <--- Yeh state se current value lega
            }
        });
        setCustomers(response.data.customers);
        setTotalItems(response.data.totalItems);
    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        setLoading(false);
    }
};

 // Is useEffect ko apne purane useEffect se replace kar den
useEffect(() => {
    // Agar user tezi se type kar raha hai, to purani call cancel kar do
    const delayDebounceFn = setTimeout(() => {
        fetchCustomers();
    }, 500); // 0.5 second ka wait

    return () => clearTimeout(delayDebounceFn);
}, [searchTerm, page, rowsPerPage]); // <--- In teeno ke change par search chalegi

    // 2. handleSearch ko simplify karein (ya hata den agar auto-search chahiye)
const handleSearch = (e) => {
    setPage(0); // Search hone par hamesha page 1 (index 0) par le jao
};

    // 3. Dialog Handlers
    const handleOpenDialog = (mode, customer = null) => {
        setDialogMode(mode);
        if (customer) {
            setSelectedCustomer(customer);
        } else {
            setSelectedCustomer({ name: '', phone: '', brandName: '', address: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCustomer({ name: '', phone: '', brandName: '', address: '' });
    };

    // 4. Submit Form (Create or Update)
    const handleSubmit = async () => {
        try {
            if (dialogMode === 'add') {
                await API.post('/customers/create-customer', selectedCustomer);
                toast.success("Customer added successfully");
            } else if (dialogMode === 'edit') {
                await API.patch(`/customers/${selectedCustomer.id}`, selectedCustomer);
                toast.success("Customer updated successfully");
            }
            handleCloseDialog();
            fetchCustomers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed!");
        }
    };

    return (
        <Box sx={{ p: 1 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main', fontSize: 30 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Customers</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenDialog('add')}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                    Add Customer
                </Button>
            </Box>

            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 2, borderRadius: '12px' }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by name or brand and press Enter..."
                    value={searchTerm}
                   onChange={(e) => {
        setSearchTerm(e.target.value);
        setPage(0); // <--- Yeh line search results ko reset karegi
    }}
                    
                    
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Brand Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}><CircularProgress size={30} /></TableCell></TableRow>
                        ) : customers.map((c) => (
                            <TableRow key={c.id} hover>
                                <TableCell>#{c.id}</TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{c.name}</TableCell>
                                <TableCell>{c.brandName}</TableCell>
                                <TableCell>{c.phone}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="View"><IconButton onClick={() => handleOpenDialog('view', c)} color="info"><ViewIcon /></IconButton></Tooltip>
                                    <Tooltip title="Edit"><IconButton onClick={() => handleOpenDialog('edit', c)} color="warning"><EditIcon /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalItems}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                />
            </TableContainer>

            {/* Add/Edit/View Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>
                    {dialogMode === 'add' ? 'Add New Customer' : dialogMode === 'edit' ? 'Edit Customer' : 'Customer Details'}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Customer Name" fullWidth size="small"
                                disabled={dialogMode === 'view'}
                                value={selectedCustomer.name}
                                onChange={(e) => setSelectedCustomer({...selectedCustomer, name: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone Number" fullWidth size="small"
                                disabled={dialogMode === 'view'}
                                value={selectedCustomer.phone}
                                onChange={(e) => setSelectedCustomer({...selectedCustomer, phone: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Brand Name" fullWidth size="small"
                                disabled={dialogMode === 'view'}
                                value={selectedCustomer.brandName}
                                onChange={(e) => setSelectedCustomer({...selectedCustomer, brandName: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address" fullWidth size="small" multiline rows={2}
                                disabled={dialogMode === 'view'}
                                value={selectedCustomer.address}
                                onChange={(e) => setSelectedCustomer({...selectedCustomer, address: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                    {dialogMode !== 'view' && (
                        <Button variant="contained" onClick={handleSubmit}>
                            {dialogMode === 'add' ? 'Save Customer' : 'Update Changes'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Customers;