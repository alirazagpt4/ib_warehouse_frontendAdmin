import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, Paper, Container, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api/axiosInstance'; // Aapka instance import ho gaya

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Ab URL poora likhne ki zaroorat nahi, sirf endpoint kaafi hai
            const response = await API.post('/users/login', credentials);

            console.log("response in login",response.data);
            
            if (response.data.token) {
                login(response.data.token); 
                toast.success('Login successful');
                setTimeout(() => {
                    navigate('/'); 
                }, 2500);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Server se connect nahi ho pa raha!');
            setError(err.response?.data?.message || 'Server se connect nahi ho pa raha!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 10 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom fontWeight="bold" color="primary">
                    IB PORTAL LOGIN
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        margin="normal"
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;