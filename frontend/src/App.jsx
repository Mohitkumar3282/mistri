import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';

// Components
import Header from './components/Header';
import MobileHeader from './components/MobileHeader';
import MobileBottomNav from './components/MobileBottomNav';
import BottomCartBar from './components/BottomCartBar';
import Footer from './components/Footer';
import LocationModal from './components/LocationModal';
import ProductOptionsModal from './components/ProductOptionsModal';
import QuotationModal from './components/QuotationModal';
import LoginModal from './components/LoginModal';
import ToastContainer from './components/Toast';

// HomeView and LoginView are the two first-paint screens (logged-in and logged-out
// landing views), so they stay in the main bundle. Every other view is only needed once
// someone actually navigates there, so it loads as its own chunk on demand instead of
// bloating what every visitor downloads just to see the home page.
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';

const CategoriesView = React.lazy(() => import('./views/CategoriesView'));
const ProductListingView = React.lazy(() => import('./views/ProductListingView'));
const SearchResultsView = React.lazy(() => import('./views/SearchResultsView'));
const ProductDetailsView = React.lazy(() => import('./views/ProductDetailsView'));
const CartView = React.lazy(() => import('./views/CartView'));
const CheckoutView = React.lazy(() => import('./views/CheckoutView'));
const OrderConfirmationView = React.lazy(() => import('./views/OrderConfirmationView'));
const MyOrdersView = React.lazy(() => import('./views/MyOrdersView'));
const OrderDetailsView = React.lazy(() => import('./views/OrderDetailsView'));
const OrderTrackingView = React.lazy(() => import('./views/OrderTrackingView'));
const WishlistView = React.lazy(() => import('./views/WishlistView'));
const ProfileView = React.lazy(() => import('./views/ProfileView'));
const AddressesView = React.lazy(() => import('./views/AddressesView'));
const NotificationsView = React.lazy(() => import('./views/NotificationsView'));
const SignupView = React.lazy(() => import('./views/SignupView'));
const ForgotPasswordView = React.lazy(() => import('./views/ForgotPasswordView'));
const AboutView = React.lazy(() => import('./views/AboutView'));
const ContactView = React.lazy(() => import('./views/ContactView'));
const HelpFaqView = React.lazy(() => import('./views/HelpFaqView'));
const TermsView = React.lazy(() => import('./views/TermsView'));
const PrivacyPolicyView = React.lazy(() => import('./views/PrivacyPolicyView'));

// Admin panel is huge and only ever used by the store owner, not shoppers - loading it
// as a separate chunk keeps it out of what every customer downloads just to browse.
const AdminView = React.lazy(() => import('./views/AdminView'));

const AdminLoadingFallback = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>Loading admin panel...</div>
  </div>
);

// A view switching in mid-page shouldn't blank the whole screen while its chunk
// downloads - render nothing for a beat instead of a visible loading flash.
const ViewLoadingFallback = () => null;

function MainAppLayout() {
  const { currentView, user } = useStore();

  const isAdminView = currentView === 'admin';

  if (isAdminView) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1 }}>
          <React.Suspense fallback={<AdminLoadingFallback />}>
            <AdminView />
          </React.Suspense>
        </main>
        <ToastContainer />
      </div>
    );
  }

  // Force Authentication Gate for unauthenticated visitors while allowing public policy pages
  if (!user) {
    const isPublicPolicyView = ['privacy', 'terms', 'help', 'contact', 'about'].includes(currentView);

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: isPublicPolicyView ? 'flex-start' : 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem',
          }}
        >
          <React.Suspense fallback={<ViewLoadingFallback />}>
          {currentView === 'signup' ? (
            <SignupView />
          ) : currentView === 'forgot-password' ? (
            <ForgotPasswordView />
          ) : currentView === 'privacy' ? (
            <PrivacyPolicyView />
          ) : currentView === 'terms' ? (
            <TermsView />
          ) : currentView === 'help' ? (
            <HelpFaqView />
          ) : currentView === 'contact' ? (
            <ContactView />
          ) : currentView === 'about' ? (
            <AboutView />
          ) : (
            <LoginView />
          )}
          </React.Suspense>
        </main>
        <ToastContainer />
      </div>
    );
  }

  // Hide global website header (logo, search bar) on categories, orders, order-details, order-tracking, profile, admin, cart, checkout
  const isCustomHeaderView = ['categories', 'orders', 'order-details', 'order-tracking', 'profile', 'admin', 'cart', 'checkout'].includes(currentView);
  const hideMobileHeader = isCustomHeaderView || currentView === 'product-details';

  const renderActiveView = () => {
    switch (currentView) {
      case 'admin':
        return (
          <React.Suspense fallback={<AdminLoadingFallback />}>
            <AdminView />
          </React.Suspense>
        );
      case 'home':
        return <HomeView />;
      case 'categories':
        return <CategoriesView />;
      case 'category-products':
        return <ProductListingView />;
      case 'search':
        return <SearchResultsView />;
      case 'product-details':
        return <ProductDetailsView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-confirmation':
        return <OrderConfirmationView />;
      case 'orders':
        return <MyOrdersView />;
      case 'order-details':
        return <OrderDetailsView />;
      case 'order-tracking':
        return <OrderTrackingView />;
      case 'wishlist':
        return <WishlistView />;
      case 'profile':
        return <ProfileView />;
      case 'addresses':
        return <AddressesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'login':
        return <LoginView />;
      case 'signup':
        return <SignupView />;
      case 'forgot-password':
        return <ForgotPasswordView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'help':
        return <HelpFaqView />;
      case 'terms':
        return <TermsView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      default:
        return <HomeView />;
    }
  };

  if (isAdminView) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1 }}>
          <React.Suspense fallback={<AdminLoadingFallback />}>
            <AdminView />
          </React.Suspense>
        </main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: isCustomHeaderView ? '#FFFFFF' : 'var(--bg-main)' }}>
      {/* Desktop Navigation Header */}
      {!isCustomHeaderView && <Header />}

      {/* Mobile Navigation Header */}
      {!hideMobileHeader && <MobileHeader />}

      {/* Dynamic Main View */}
      <main style={{ flex: 1 }}>
        <React.Suspense fallback={<ViewLoadingFallback />}>
          {renderActiveView()}
        </React.Suspense>
      </main>

      {/* Universal Footer */}
      {!isCustomHeaderView && <Footer />}

      {/* Floating Bottom Cart Notification Bar (Quick Commerce Style) */}
      <BottomCartBar />

      {/* Mobile Sticky Bottom Bar (5 Tabs) */}
      <MobileBottomNav />

      {/* Location Deliver-to Selector Modal */}
      <LocationModal />

      {/* Product Specification / Variant Selector Modal */}
      <ProductOptionsModal />

      {/* Instant WhatsApp Quotation Request Modal */}
      <QuotationModal />

      {/* User Login & Registration Modal */}
      <LoginModal />

      {/* Global Toast Alert Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainAppLayout />
    </StoreProvider>
  );
}
