import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './adminauth/components/Layout';
import ProtectedRoute from './adminauth/components/ProtectedRoute';
import Login from './adminauth/pages/auth/Login';
import AdminRegister from './adminauth/pages/auth/AdminRegister';
import Dashboard from './adminauth/pages/dashboard/Dashboard';
import RoleManagement from './adminauth/pages/dashboard/RoleManagement';
import UserManagement from './adminauth/pages/dashboard/UserManagement';
import ModulePage from './adminauth/pages/dashboard/ModulePage';
import PurchaseEntry from './purchase/PurchaseEntry';
import PurchaseOrder from './purchase/PurchaseOrder';
import PurchaseReturn from './purchase/PurchaseReturn';

import SaleEntry from './sales/SaleEntry';
import Quotation from './sales/Quotation';
import SaleReturn from './sales/SaleReturn';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register-admin" element={<AdminRegister />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="categories" element={<ModulePage title="Categories" module="category" />} />
        <Route path="products" element={<ModulePage title="Products" module="product" />} />
        <Route path="customers" element={<ModulePage title="Customers" module="customer" />} />
        <Route path="suppliers" element={<ModulePage title="Suppliers" module="supplier" />} />
        <Route path="tax" element={<ModulePage title="Tax" module="tax" />} />
        
        {/* Sales Routes */}
        <Route path="sales">
          <Route path="entry" element={<SaleEntry />} />
          <Route path="quotations" element={<Quotation />} />
          <Route path="returns" element={<SaleReturn />} />
        </Route>
        
        {/* Purchase Routes */}
        <Route path="purchase">
          <Route path="entry" element={<PurchaseEntry />} />
          <Route path="orders" element={<PurchaseOrder />} />
          <Route path="returns" element={<PurchaseReturn />} />
        </Route>
        <Route path="roles" element={
          <ProtectedRoute module="roles" action="manage">
            <RoleManagement />
          </ProtectedRoute>
        } />

        <Route path="users" element={
          <ProtectedRoute module="users" action="manage">
            <UserManagement />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
