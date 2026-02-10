import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, TextField,
  IconButton, Tooltip, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, MenuItem, Chip, Card, CardContent
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Search as SearchIcon,
  Inventory as PackageIcon, Person as PersonIcon, LocalShipping as ShippingIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import API from '../api/axiosInstance';
import { toast } from 'react-toastify';

// Professional Status Config
const BOOKING_STATUS = {
  1: { label: 'Received', color: 'primary' },
  2: { label: 'In Warehouse', color: 'info' },
  3: { label: 'Shipment Created', color: 'secondary' },
  4: { label: 'Customs Clearance', color: 'warning' },
  5: { label: 'In Transit', color: 'warning' },
  6: { label: 'Arrived at Destination', color: 'info' },
  7: { label: 'Out for Delivery', color: 'warning' },
  8: { label: 'Delivered', color: 'success' },
  9: { label: 'Cancelled/Hold', color: 'error' },
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedBooking, setSelectedBooking] = useState({
    customerId: '', description: '', weight: '', volume: '', noOfCartons: '', hsCode: '', status: 1
  });

  // 1. Fetch Bookings with Search & Pagination
  const fetchBookings = async (currentSearch = searchTerm) => {
    try {
      setLoading(true);
      const response = await API.get(`/bookings`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: currentSearch
        }
      });
      setBookings(response.data.bookings);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      toast.error("Bookings load nahi ho sakeen!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBookings(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page, rowsPerPage]);

  // 2. Dialog Handlers
  const handleOpenDialog = (mode, booking = null) => {
    setDialogMode(mode);
    if (booking) {
      setSelectedBooking(booking);
    } else {
      setSelectedBooking({ customerId: '', description: '', weight: '', volume: '', noOfCartons: '', hsCode: '', status: 1 });
    }
    setOpenDialog(true);
  };

  // 3. Create or Update Booking
  const handleSubmit = async () => {
    try {
      if (dialogMode === 'add') {
        await API.post('/bookings/create-booking', selectedBooking);
        toast.success("Booking created successfully!");
      } else {
        // Destructure karke sirf zaroori data bhejna behtar hai
        const { id, trackingId, createdAt, updatedAt, customerDetail, ...updateData } = selectedBooking;
        await API.patch(`/bookings/${id}`, updateData);
        toast.success("Booking status updated!");
      }
      setOpenDialog(false);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed!");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header Area */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a237e' }}>
          <PackageIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> IB Bookings
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog('add')} sx={{ borderRadius: 2 }}>
          Create Booking
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          fullWidth size="small"
          placeholder="Search by Tracking ID, Customer or Description..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'gray', mr: 1 }} />
          }}
        />
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Tracking ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer / Brand</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stats (W/V/C)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell></TableRow>
            ) : bookings.map((b) => (
              <TableRow key={b.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{b.trackingId}</Typography></TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{b.customerDetail?.name}</Typography>
                  <Typography variant="caption" color="textSecondary">{b.customerDetail?.brandName}</Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 250 }}>
                  <Tooltip title={b.description}><Typography variant="body2" noWrap>{b.description}</Typography></Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" display="block">W: {b.weight}kg</Typography>
                  <Typography variant="caption" display="block">V: {b.volume}</Typography>
                  <Typography variant="caption">C: {b.noOfCartons}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={BOOKING_STATUS[b.status]?.label}
                    color={BOOKING_STATUS[b.status]?.color}
                    size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                  />
                </TableCell>
                <TableCell align="center">
                  {/* View Button */}
  <Tooltip title="View Details">
    <IconButton onClick={() => handleOpenDialog('view', b)} color="info">
      <ViewIcon fontSize="small" />
    </IconButton>
  </Tooltip>
                  <IconButton size="small" onClick={() => handleOpenDialog('edit', b)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div" count={totalItems} page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
        />
      </TableContainer>

      {/* Dialog for Add/Edit Status */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{dialogMode === 'add' ? 'New Booking' : 'Update Booking Status'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {dialogMode === 'add' && (
              <Grid item xs={12}>
                <TextField label="Customer ID" fullWidth size="small" value={selectedBooking.customerId} disabled={dialogMode === 'view'} onChange={(e) => setSelectedBooking({ ...selectedBooking, customerId: e.target.value })} />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                select label="Update Current Status" fullWidth size="small"
                value={selectedBooking.status}
                disabled={dialogMode === 'view'}
                onChange={(e) => setSelectedBooking({ ...selectedBooking, status: e.target.value })}
              >
                {Object.entries(BOOKING_STATUS).map(([key, value]) => (
                  <MenuItem key={key} value={parseInt(key)}>{key} - {value.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" fullWidth multiline rows={2}  disabled={dialogMode === 'view'} size="small" value={selectedBooking.description} onChange={(e) => setSelectedBooking({ ...selectedBooking, description: e.target.value })} />
            </Grid>
            <Grid item xs={4}><TextField label="Weight" fullWidth size="small" value={selectedBooking.weight} disabled={dialogMode === 'view'} onChange={(e) => setSelectedBooking({ ...selectedBooking, weight: e.target.value })} /></Grid>
            <Grid item xs={4}><TextField label="Volume" fullWidth size="small" value={selectedBooking.volume} disabled={dialogMode === 'view'} onChange={(e) => setSelectedBooking({ ...selectedBooking, volume: e.target.value })} /></Grid>
            <Grid item xs={4}><TextField label="Cartons" fullWidth size="small" value={selectedBooking.noOfCartons} disabled={dialogMode === 'view'}  onChange={(e) => setSelectedBooking({ ...selectedBooking, noOfCartons: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
    {dialogMode === 'view' ? 'Close' : 'Cancel'}
  </Button>
          <Button variant="contained" onClick={handleSubmit}>Confirm Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookings;