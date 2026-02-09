import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// Pages ko lazy load kar rahe hain performance ke liye
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Customers = lazy(() => import('./pages/Customers'));
const Bookings = lazy(() => import('./pages/Bookings'));

function App() {
    const { token } = useContext(AuthContext);

    return (
      <>
        <Router>
            <Suspense fallback={<div style={{ padding: '20px' }}>Loading...</div>}>
                <Routes>
                    {/* Agar login nahi hai toh Login page, warna redirect to Dashboard */}
                    <Route 
                        path="/login" 
                        element={!token ? <Login /> : <Navigate to="/" />} 
                        />

                    {/* Protected Routes: Sirf login users ke liye */}
                    <Route 
                        path="/" 
                        element={token ? <Layout /> : <Navigate to="/login" />}
                        >
                        {/* Yeh sub-routes Layout ke andar 'Outlet' mein render honge */}
                        <Route index element={<Dashboard />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="bookings" element={<Bookings />} />
                    </Route>

                    {/* Koi bhi ghalat URL ho toh home par bhej do */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Suspense>
        </Router>
        <ToastContainer />
        
                      </>
    );
}

export default App;