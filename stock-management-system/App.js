import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import InventoryForm from './components/InventoryForm';
import Reports from './components/Reports';
import styled from '@emotion/styled';

// Global container with background image
const AppContainer = styled.div
  min-height: 100vh;
  background-color: #1a1a2e; /* Deep dark blue for a professional look */
  color: #fff; /* White text for contrast */
  font-family: 'Roboto', sans-serif; /* Stylish, modern font */
`;


function App() {
    return (
        <AppContainer>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/inventory" element={<InventoryForm />} />
                    <Route path="/reports" element={<Reports />} />
                </Routes>
            </Router>
        </AppContainer>
    );
}

export default App;
