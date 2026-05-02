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
import { 
  Suppliers, SupplierCreate, SupplierEdit, SupplierView,
  Customers, CustomerCreate, CustomerEdit, CustomerView,
  Categories, CategoryCreate, CategoryEdit,
  Taxes, TaxCreate, TaxEdit,
  Products, ProductCreate, ProductEdit, ProductView 
} from './mastermodel/pages';

import SaleEntry from './sales/SaleEntry';
import Quotation from './sales/Quotation';
import NewQuotation from './sales/NewQuotation';
import SaleReturn from './sales/SaleReturn';
import NewSaleReturn from './sales/NewSaleReturn';

import PurchaseEntry from './purchase/PurchaseEntry';
import PurchaseOrder from './purchase/PurchaseOrder';
import NewPurchaseOrder from './purchase/NewPurchaseOrder';
import PurchaseReturn from './purchase/PurchaseReturn';
import NewPurchaseReturn from './purchase/NewPurchaseReturn';
import StockManagement from './stock/StockManagement';
import BillingDashboard from './bill/BillingDashboard';
import NewCustomerBill from './bill/NewCustomerBill';
import NewSupplierBill from './bill/NewSupplierBill';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register-admin" element={<AdminRegister />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Master Model Routes */}
        <Route path="products">
          <Route index element={<Products />} />
          <Route path="create" element={<ProductCreate />} />
          <Route path="edit/:id" element={<ProductEdit />} />
          <Route path="view/:id" element={<ProductView />} />
        </Route>
        <Route path="customers">
          <Route index element={<Customers />} />
          <Route path="create" element={<CustomerCreate />} />
          <Route path="edit/:id" element={<CustomerEdit />} />
          <Route path="view/:id" element={<CustomerView />} />
        </Route>
        
        <Route path="suppliers">
          <Route index element={<Suppliers />} />
          <Route path="create" element={<SupplierCreate />} />
          <Route path="edit/:id" element={<SupplierEdit />} />
          <Route path="view/:id" element={<SupplierView />} />
        </Route>

        <Route path="categories">
          <Route index element={<Categories />} />
          <Route path="create" element={<CategoryCreate />} />
          <Route path="edit/:id" element={<CategoryEdit />} />
        </Route>
        <Route path="taxes">
          <Route index element={<Taxes />} />
          <Route path="create" element={<TaxCreate />} />
          <Route path="edit/:id" element={<TaxEdit />} />
        </Route>
        
        {/* Sales Routes */}
        <Route path="sales">
          <Route path="entry" element={<SaleEntry />} />
          <Route path="quotations" element={<Quotation />} />
          <Route path="quotations/new" element={<NewQuotation />} />
          <Route path="returns" element={<SaleReturn />} />
          <Route path="returns/new" element={<NewSaleReturn />} />
          <Route index element={<ModulePage title="Sales" module="sale" />} />
        </Route>
        
        {/* Purchase Routes */}
        <Route path="purchase">
          <Route path="entry" element={<PurchaseEntry />} />
          <Route path="orders" element={<PurchaseOrder />} />
          <Route path="orders/new" element={<NewPurchaseOrder />} />
          <Route path="returns" element={<PurchaseReturn />} />
          <Route path="returns/new" element={<NewPurchaseReturn />} />
          <Route index element={<ModulePage title="Purchases" module="purchase" />} />
        </Route>

        {/* Stock Routes */}
        <Route path="stock" element={<StockManagement />} />

        {/* Billing Routes */}
        <Route path="billing">
          <Route index element={<BillingDashboard />} />
          <Route path="customer/new" element={<NewCustomerBill />} />
          <Route path="supplier/new" element={<NewSupplierBill />} />
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
