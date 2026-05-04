import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Brands from './pages/Brands';
import Product from './pages/Product';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';

// Admin Pages
import AdminDashboardRedirect from './pages/AdminDashboard';
import Dashboard from './pages/admin/dashboard/page';
import AllProducts from './pages/admin/allproduct/page';
import Brand from './pages/admin/brand/page';
import Categorie from './pages/admin/categorie/page';
import Collection from './pages/admin/collection/page';
import TaxRule from './pages/admin/taxrule/page';
import ProductAdmin from './pages/admin/product/page';
import ProductEdit from './pages/admin/productedit/[id]/page';
import WebsiteOrders from './pages/admin/orders/websiteOrders/page';
import OrderDetails from './pages/admin/orders/websiteOrders/orderdetails/[id]/page';
import UserAdmin from './pages/admin/user/page';
import Subscription from './pages/admin/subscription/page';
import Settings from './pages/admin/settings/page';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/product" element={<Product />} />
          <Route path="/ProductDetails/:id" element={<ProductDetails />} />
          <Route path="/account/login" element={<Login />} />
        </Route>

        {/* Admin Routes with AdminLayout and Protection */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboardRedirect />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="allproduct" element={<AllProducts />} />
          <Route path="brand" element={<Brand />} />
          <Route path="categorie" element={<Categorie />} />
          <Route path="collection" element={<Collection />} />
          <Route path="taxrule" element={<TaxRule />} />
          <Route path="product" element={<ProductAdmin />} />
          <Route path="productedit/:id" element={<ProductEdit />} />
          <Route path="orders/websiteOrders" element={<WebsiteOrders />} />
          <Route path="orders/websiteOrders/orderdetails/:id" element={<OrderDetails />} />
          <Route path="user" element={<UserAdmin />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
