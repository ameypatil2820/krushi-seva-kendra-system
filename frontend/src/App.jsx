import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './adminauth/context/AuthContext';
import Layout from './adminauth/components/Layout';
import ProtectedRoute from './adminauth/components/ProtectedRoute';
import Login from './adminauth/pages/auth/Login';
import AdminRegister from './adminauth/pages/auth/AdminRegister';
import Dashboard from './adminauth/pages/dashboard/Dashboard';
import RoleManagement from './adminauth/pages/dashboard/RoleManagement';
import UserManagement from './adminauth/pages/dashboard/UserManagement';
import ModulePage from './adminauth/pages/dashboard/ModulePage';
import { Suppliers, Customers, Categories, Taxes, Products } from './mastermodel/pages';

import SaleEntry from './sales/SaleEntry';
import Quotation from './sales/Quotation';
import SaleReturn from './sales/SaleReturn';

import PurchaseEntry from './purchase/PurchaseEntry';
import PurchaseOrder from './purchase/PurchaseOrder';
import PurchaseReturn from './purchase/PurchaseReturn';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register-admin" element={<AdminRegister />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Master Model Routes */}
        <Route path="products" element={<Products />} />
        <Route path="customers" element={<Customers />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="categories" element={<Categories />} />
        <Route path="taxes" element={<Taxes />} />
        <Route path="tax" element={<Taxes />} />
        
        {/* Sales Routes */}
        <Route path="sales">
          <Route path="entry" element={<SaleEntry />} />
          <Route path="quotations" element={<Quotation />} />
          <Route path="returns" element={<SaleReturn />} />
          <Route index element={<ModulePage title="Sales" module="sale" />} />
        </Route>
        
        {/* Purchase Routes */}
        <Route path="purchase">
          <Route path="entry" element={<PurchaseEntry />} />
          <Route path="orders" element={<PurchaseOrder />} />
          <Route path="returns" element={<PurchaseReturn />} />
          <Route index element={<ModulePage title="Purchases" module="purchase" />} />
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
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
