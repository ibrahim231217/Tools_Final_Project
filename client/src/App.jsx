import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrderScreen from "./screens/OrderScreen";
import ContactScreen from "./screens/ContactScreen";
import AboutScreen from "./screens/AboutScreen";
import WishlistScreen from "./screens/WishlistScreen";
import ScrollToTop from "./components/ScrollToTop";

// Checkout Screens
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";

// Admin Screens
import DashboardScreen from "./screens/admin/DashboardScreen";
import AdminProductListScreen from "./screens/admin/ProductListScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";
import OrderListScreen from "./screens/admin/OrderListScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";

import { Toaster } from "react-hot-toast";

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.isAdmin ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/profile" />
  );
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="flex flex-col min-h-screen relative">
            <ScrollToTop />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />

            {/* Scroll Fade Mask - Hide on Admin */}
            {!isAdminRoute && (
              <div
                className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--color-surface)] to-transparent z-30 pointer-events-none"
                aria-hidden="true"
              />
            )}

            {!isAdminRoute && <Header />}

            <main className="flex-grow bg-background">
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/products" element={<ProductListScreen />} />
                <Route path="/products/:id" element={<ProductScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/contact" element={<ContactScreen />} />
                <Route path="/about" element={<AboutScreen />} />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={<DashboardRedirect />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/wishlist" element={<WishlistScreen />} />

                {/* Checkout Flow */}
                <Route path="/shipping" element={<ShippingScreen />} />
                <Route path="/payment" element={<PaymentScreen />} />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/order/:id" element={<OrderScreen />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="dashboard" element={<DashboardScreen />} />
                    <Route
                      path="productlist"
                      element={<AdminProductListScreen />}
                    />
                    <Route
                      path="product/:id/edit"
                      element={<ProductEditScreen />}
                    />
                    <Route path="orderlist" element={<OrderListScreen />} />
                    <Route path="userlist" element={<UserListScreen />} />
                    <Route path="user/:id/edit" element={<UserEditScreen />} />
                  </Route>
                </Route>
              </Routes>
            </main>
            {!isAdminRoute && <Footer />}
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
