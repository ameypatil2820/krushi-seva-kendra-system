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

import SaleBill from './sales/SaleBill';
import SaleEntry from './sales/SaleEntry';
import Quotation from './sales/Quotation';
import NewQuotation from './sales/NewQuotation';
import SaleReturn from './sales/SaleReturn';
import NewSaleReturn from './sales/NewSaleReturn';
import ViewSaleReturn from './sales/ViewSaleReturn';
import ViewSaleBill from './sales/ViewSaleBill';

import PurchaseBill from './purchase/PurchaseBill';
import ViewPurchaseBill from './purchase/ViewPurchaseBill';
import PurchaseEntry from './purchase/PurchaseEntry';
import PurchaseOrder from './purchase/PurchaseOrder';
import NewPurchaseOrder from './purchase/NewPurchaseOrder';
import ViewPurchaseOrder from './purchase/ViewPurchaseOrder';
import PurchaseReturn from './purchase/PurchaseReturn';
import NewPurchaseReturn from './purchase/NewPurchaseReturn';
import ViewPurchaseReturn from './purchase/ViewPurchaseReturn';
import StockMaster from './stock/StockMaster';
import StockChild from './stock/StockChild';
import ExpiryTracking from './stock/ExpiryTracking';

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
          <Route path="bills" element={<SaleBill />} />
          <Route path="bills/view/:id" element={<ViewSaleBill />} />
          <Route path="entry" element={<SaleEntry />} />
          <Route path="quotations" element={<Quotation />} />
          <Route path="quotations/new" element={<NewQuotation />} />
          <Route path="returns" element={<SaleReturn />} />
          <Route path="returns/new" element={<NewSaleReturn />} />
          <Route path="returns/view/:id" element={<ViewSaleReturn />} />
          <Route index element={<ModulePage title="Sales" module="sale" />} />
        </Route>
        
        {/* Purchase Routes */}
        <Route path="purchase">
          <Route path="bills" element={<PurchaseBill />} />
          <Route path="bills/view/:id" element={<ViewPurchaseBill />} />
          <Route path="entry" element={<PurchaseEntry />} />
          <Route path="orders" element={<PurchaseOrder />} />
          <Route path="orders/new" element={<NewPurchaseOrder />} />
          <Route path="orders/view/:id" element={<ViewPurchaseOrder />} />
          <Route path="returns" element={<PurchaseReturn />} />
          <Route path="returns/new" element={<NewPurchaseReturn />} />
          <Route path="returns/view/:id" element={<ViewPurchaseReturn />} />
          <Route index element={<ModulePage title="Purchases" module="purchase" />} />
        </Route>

        {/* Stock Routes */}
        <Route path="stock">
          <Route index element={<Navigate to="master" />} />
          <Route path="master" element={<StockMaster />} />
          <Route path="child" element={<StockChild />} />
          <Route path="expiry" element={<ExpiryTracking />} />
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
