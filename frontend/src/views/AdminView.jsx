import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  Wrench,
  Calendar,
  Users,
  Tag,
  MessageSquareQuote,
  Image as ImageIcon,
  HelpCircle,
  Settings,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Filter,
  Eye,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  Award,
  Sparkles,
  Zap,
  ArrowUpRight,
  RefreshCw,
  Send,
  Sliders,
  Star,
  FileText,
  Radio,
  MoreVertical,
  Maximize2,
  Bell,
  CheckSquare,
  Square,
  FolderTree,
  Grid,
  UploadCloud,
  LogOut,
  Store,
  Menu,
  Activity,
  Bookmark,
  Compass,
  Headphones,
  Lock,
  EyeOff,
  Key,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Logo from '../components/Logo';

export default function AdminView() {
  const {
    adminActiveTab,
    setAdminActiveTab,
    navigateTo,
    // Admin Authentication
    adminUser,
    adminLogin,
    adminLogout,
    // Dynamic Collections & CRUD
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    toggleProductFeatured,
    categories,
    categorySections,
    addCategory,
    updateCategory,
    deleteCategory,
    addCategorySection,
    updateCategorySection,
    deleteCategorySection,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    orders,
    updateOrderStatus,
    updateOrderTracking,
    updateOrderDriver,
    updateOrderPayment,
    deleteOrder,
    services,
    addService,
    updateService,
    deleteService,
    mistris,
    addMistri,
    updateMistri,
    deleteMistri,
    toggleMistriAvailability,
    toggleMistriVerified,
    bookings,
    updateBookingStatus,
    assignMistriToBooking,
    deleteBooking,
    usersList,
    addUser,
    updateUser,
    deleteUser,
    updateUserTier,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    quotations,
    updateQuotationStatus,
    deleteQuotation,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    supportMessages,
    updateSupportMessageStatus,
    siteSettings,
    updateSiteSettings,
    cities,
    addCity,
    removeCity,
    resetToDefaultData,
    addToast,
    user,
  } = useStore();

  // Sidebar & View state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isTreeView, setIsTreeView] = useState(false);
  const [categoryViewMode, setCategoryViewMode] = useState('table'); // 'table' | 'grid'

  // Category Sidebar Accordion expansion state
  const isCategoryTab = ['categories', 'parent-categories', 'sub-categories', 'category-products'].includes(adminActiveTab);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(true);

  // Parent Category View Filters
  const [parentCategorySearch, setParentCategorySearch] = useState('');
  const [parentCategoryStatusFilter, setParentCategoryStatusFilter] = useState('All');

  // Subcategory View Filters
  const [subCategorySearch, setSubCategorySearch] = useState('');
  const [subCategoryParentFilter, setSubCategoryParentFilter] = useState('All');
  const [subCategoryMainFilter, setSubCategoryMainFilter] = useState('All');

  // Category Hierarchy 2-Column View State (Reference Image Match)
  const [selectedHierarchyParent, setSelectedHierarchyParent] = useState(null);
  const [hierarchyParentSearch, setHierarchyParentSearch] = useState('');

  // Product Catalog Dataset Filters & State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productSectionFilter, setProductSectionFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('All'); // 'All' | 'inStock' | 'lowStock' | 'outOfStock'
  const [productCatalogTab, setProductCatalogTab] = useState('master'); // 'master' | 'seller' | 'alerts'
  const [productModalTab, setProductModalTab] = useState('general'); // 'general' | 'categories' | 'variants' | 'photos'
  const [productActionMenuId, setProductActionMenuId] = useState(null);
  const [isRefreshingProducts, setIsRefreshingProducts] = useState(false);

  // Product Create/Edit Form State
  const [productFormData, setProductFormData] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    brand: '',
    section: 'Civil & Interiors',
    category: '',
    categorySlug: '',
    subcategory: '',
    unit: '',
    mrp: '',
    price: '',
    stockCount: '',
    minOrderQty: 1,
    gstRate: 18,
    image: '',
    status: 'PUBLISHED',
    isFeatured: false,
  });

  // Table selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal Dialogs state
  const [activeModal, setActiveModal] = useState(null); // 'add-category' | 'add-parent-category' | 'add-sub-category' | 'edit-sub-category' | 'edit-parent-category' | 'create-product' | 'edit-product'
  const [modalFormData, setModalFormData] = useState({});

  // Profile Menu Dropdown
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Material Library Preset HD Images for 1-Click Upload
  const PRESET_MATERIAL_IMAGES = [
    { label: 'OPC & PPC Cement Bags', url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400', category: 'Civil' },
    { label: 'TMT Steel Rebars & Beams', url: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&q=80&w=400', category: 'Structural' },
    { label: 'Vitrified Ceramic Floor Tiles', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400', category: 'Tiling' },
    { label: 'Exterior Emulsion & Putty', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400', category: 'Painting' },
    { label: 'Integral Waterproofing & SBR', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400', category: 'Chemicals' },
    { label: 'BWP Marine Plywood & MDF', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=400', category: 'Plywood' },
    { label: 'Heavy Duty CPVC Pipes & Fittings', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400', category: 'Plumbing' },
    { label: 'FR-LSH Copper Wires & MCB DB', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400', category: 'Electrical' },
    { label: 'Modular Switch Plates & Glass', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400', category: 'Electrical' },
    { label: 'LED Ceiling Panels & COB Lights', url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=400', category: 'Lighting' },
    { label: 'Impact Drills & Power Cutters', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400', category: 'Tools' },
    { label: 'Soft Close Hinges & Telescopic Channels', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400', category: 'Hardware' },
    { label: 'Smart Biometric Door Locks', url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=400', category: 'Security' },
    { label: 'Red Clay Bricks & AAC Blocks', url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80&w=400', category: 'Civil' },
  ];

  // Dynamic list of all subcategories across categories
  const allSubCategories = useMemo(() => {
    const list = [];
    categories.forEach((cat) => {
      const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
      subs.forEach((subName) => {
        const prodCount = products.filter(
          (p) =>
            p.categorySlug === cat.slug ||
            p.category?.toLowerCase() === cat.name?.toLowerCase() ||
            p.name?.toLowerCase().includes(subName.toLowerCase())
        ).length || (cat.name === 'Cement' ? 12 : cat.name === 'Tiling' ? 8 : 6);

        const img =
          (cat.subcategoryImages && cat.subcategoryImages[subName]) ||
          cat.image ||
          'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=300';

        list.push({
          id: `${cat.id || cat.slug}_${subName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name: subName,
          categoryName: cat.name,
          categorySlug: cat.slug,
          categoryId: cat.id,
          sectionName: cat.section || cat.sectionName || 'Civil & Interiors',
          image: img,
          prodCount,
          isActive: cat.isActive !== false,
        });
      });
    });
    return list;
  }, [categories, products]);

  // Sidebar Menu Items definition (With expandable 3 tabs under Categories & Products replaced attributes)
  const sidebarNavGroups = [
    {
      group: null, // Top-level
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'CATALOG',
      items: [
        { id: 'products', label: 'Products', icon: Package, badge: products.length || '35' },
        {
          id: 'categories',
          label: 'Categories & Sections',
          icon: Layers,
          isExpandable: true,
          badge: categories.length || '12',
          children: [
            { id: 'categories', label: 'All Categories', icon: Grid, badge: categories.length },
            { id: 'parent-categories', label: 'Parent Categories', icon: FolderTree, badge: categories.length },
            { id: 'sub-categories', label: 'Sub Categories', icon: Tag, badge: allSubCategories.length },
          ],
        },
        { id: 'brands', label: 'Brands', icon: Award },
      ],
    },
    {
      group: 'ORDERS',
      items: [
        { id: 'orders', label: 'Orders & Logistics', icon: Truck, badge: orders.filter(o => o.statusCode !== 'delivered').length || '14' },
        { id: 'live-tracking', label: 'Live Tracking', icon: Compass },
      ],
    },
    {
      group: 'USERS',
      items: [
        { id: 'customers', label: 'Customers', icon: Users, badge: '1.2K' },
      ],
    },
    {
      group: 'MARKETING',
      items: [
        { id: 'coupons', label: 'Coupons & Promos', icon: Tag, badge: coupons.filter(c => c.isActive).length || '4' },
        { id: 'banners', label: 'Banners & Content', icon: ImageIcon, badge: banners.length || '4' },
      ],
    },
    {
      group: 'SERVICES',
      items: [
        { id: 'bookings', label: 'Bookings', icon: Calendar, badge: bookings.length || '6' },
        { id: 'services', label: 'Mistris & Services', icon: Wrench },
      ],
    },
    {
      group: 'COMMUNICATION',
      items: [
        { id: 'quotations', label: 'Project Quotes & BOQs', icon: MessageSquareQuote, badge: quotations.filter(q => q.status !== 'Closed').length || '1', badgeStyle: 'blue-pill' },
        { id: 'faqs', label: 'Support & FAQs', icon: HelpCircle },
      ],
    },
    {
      group: 'SETTINGS',
      items: [
        { id: 'settings', label: 'General Settings', icon: Settings },
        { id: 'admin-users', label: 'Admin Users', icon: ShieldCheck },
        { id: 'system-logs', label: 'System Logs', icon: Activity },
      ],
    },
  ];

  const handleTabChange = (tabId) => {
    setAdminActiveTab(tabId);
    navigateTo('admin', { tab: tabId }, true);
    setSearchTerm('');
    setSelectedIds([]);
  };

  // Reusable Image Upload Field Component
  function ImageUploadField({ label = 'Product / Category Image', value, onChange, placeholder = 'Upload image file or paste URL' }) {
    const [dragOver, setDragOver] = useState(false);
    const [showPresets, setShowPresets] = useState(false);

    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('File size exceeds 5MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          onChange(uploadEvent.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          onChange(uploadEvent.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.textDark }}>{label}</label>
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.primaryBlue,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={12} /> {showPresets ? 'Hide Sample Photos' : '✨ Choose Sample Photo'}
          </button>
        </div>

        {showPresets && (
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            padding: '0.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))',
            gap: '8px',
            maxHeight: '160px',
            overflowY: 'auto',
            marginBottom: '4px',
          }}>
            {PRESET_MATERIAL_IMAGES.map((preset, pIdx) => (
              <div
                key={pIdx}
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                style={{
                  cursor: 'pointer',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: value === preset.url ? `2px solid ${theme.primaryBlue}` : '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'center',
                  transition: 'transform 0.15s ease',
                }}
                title={preset.label}
              >
                <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '48px', objectFit: 'cover' }} />
                <div style={{ fontSize: '0.62rem', fontWeight: 600, color: theme.textDark, padding: '2px 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {preset.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? theme.primaryBlue : '#CBD5E1'}`,
            borderRadius: '10px',
            padding: '0.75rem 0.85rem',
            backgroundColor: dragOver ? '#EFF6FF' : '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{
            position: 'relative',
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#E2E8F0',
            flexShrink: 0,
            border: '1px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {value ? (
              <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <ImageIcon size={22} color="#94A3B8" />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: theme.textDark,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <UploadCloud size={14} color={theme.primaryBlue} /> Upload from Device
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear Image
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder={placeholder}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.75rem',
                backgroundColor: '#FFFFFF',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Categories Dataset Filtering & Pagination
  // -------------------------------------------------------------
  const filteredCategories = useMemo(() => {
    let list = categories.map((cat, idx) => {
      // Enrich with counts if not present
      const subCount = cat.subcategories?.length || (idx % 5) + 4;
      const prodCount = cat.productCount || [128, 86, 54, 42, 118, 76, 132, 64, 58, 49][idx % 10] || 50;
      const sectionName = cat.section || (idx < 7 ? 'Civil & Interiors' : idx === 7 ? 'Electrical' : 'Furniture & Architectural');
      const isActive = cat.isActive !== false;
      const createdOn = cat.createdOn || '12 Jan 2024, 10:30 AM';
      const lastUpdated = cat.lastUpdated || '16 Sep 2024, 02:45 PM';

      return {
        ...cat,
        subCount,
        prodCount,
        sectionName,
        isActive,
        createdOn,
        lastUpdated,
      };
    });

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.slug?.toLowerCase().includes(q) ||
          c.sectionName?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    if (selectedSectionFilter !== 'All') {
      list = list.filter((c) => c.sectionName === selectedSectionFilter);
    }

    if (selectedStatusFilter !== 'All') {
      const wantActive = selectedStatusFilter === 'Active';
      list = list.filter((c) => c.isActive === wantActive);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'products-desc') return b.prodCount - a.prodCount;
      if (sortBy === 'products-asc') return a.prodCount - b.prodCount;
      return 0;
    });

    return list;
  }, [categories, searchTerm, selectedSectionFilter, selectedStatusFilter, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCategories.slice(start, start + rowsPerPage);
  }, [filteredCategories, currentPage, rowsPerPage]);

  // Handle selection toggles
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedCategories.map((c) => c.id || c.slug));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle Drawer Save Changes
  const handleSaveDrawer = () => {
    if (!editFormData) return;
    updateCategory(editFormData.id || editFormData.slug, editFormData);
    setInspectedCategory({ ...editFormData });
    addToast('Category changes saved successfully!', 'success');
  };

  // Handle Delete Category
  const handleDeleteCategory = (cat) => {
    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      deleteCategory(cat.id || cat.slug);
      if (inspectedCategory?.id === cat.id) {
        setInspectedCategory(categories.find((c) => c.id !== cat.id) || null);
      }
      addToast(`Category ${cat.name} removed`, 'info');
    }
  };

  // Batch actions
  const handleBatchActivate = () => {
    selectedIds.forEach((id) => {
      updateCategory(id, { isActive: true });
    });
    addToast(`Activated ${selectedIds.length} categories`, 'success');
    setSelectedIds([]);
  };

  const handleBatchDeactivate = () => {
    selectedIds.forEach((id) => {
      updateCategory(id, { isActive: false });
    });
    addToast(`Deactivated ${selectedIds.length} categories`, 'warning');
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected categories?`)) {
      selectedIds.forEach((id) => deleteCategory(id));
      setSelectedIds([]);
      addToast('Selected categories deleted', 'info');
    }
  };

  // -------------------------------------------------------------
  // Product Catalog Dataset Filtering & Calculations
  // -------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    let list = products.map((p, idx) => {
      const mrp = Number(p.mrp) || Math.round((Number(p.price) || 350) * 1.25);
      const price = Number(p.price) || 300;
      const marginAmount = Math.max(0, mrp - price);
      const marginPercent = Math.round((marginAmount / (mrp || 1)) * 100);
      const stock = typeof p.stockCount === 'number' ? p.stockCount : (p.inStock !== false ? 350 : 0);
      const inStock = p.inStock !== false && stock > 0;
      const isLowStock = stock > 0 && stock <= 80;
      const isOutOfStock = !inStock || stock === 0;

      // Multi-hub stock indicators (HA: Hub Available, HR: Hub Reserved, SA: Site Available, SC: Site Consigned)
      const haStock = stock;
      const hrStock = Math.round(stock * 0.12);
      const saStock = Math.round(stock * 0.35);
      const scStock = isOutOfStock ? 0 : Math.round(stock * 0.04);

      return {
        ...p,
        mrp,
        price,
        marginAmount,
        marginPercent,
        stock,
        inStock,
        isLowStock,
        isOutOfStock,
        haStock,
        hrStock,
        saStock,
        scStock,
        seller: p.seller || 'Hub Catalog',
        unit: p.unit || 'Unit',
        category: p.category || 'General Material',
        subcategory: p.subcategory || 'Standard Specification',
        brand: p.brand || 'Mistri Verified',
        status: p.status || (inStock ? 'PUBLISHED' : 'OUT_OF_STOCK'),
        specText: p.specText || (p.specifications && Object.values(p.specifications)[0]) || '51 Microns | Heavy Gauge',
      };
    });

    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q)
      );
    }

    if (productCategoryFilter !== 'All') {
      list = list.filter(
        (p) =>
          p.category === productCategoryFilter ||
          p.categorySlug === productCategoryFilter ||
          p.name?.toLowerCase().includes(productCategoryFilter.toLowerCase())
      );
    }

    if (productSectionFilter !== 'All') {
      list = list.filter((p) => p.section === productSectionFilter || p.sectionName === productSectionFilter);
    }

    if (productStockFilter === 'inStock') {
      list = list.filter((p) => p.inStock && !p.isOutOfStock);
    } else if (productStockFilter === 'lowStock') {
      list = list.filter((p) => p.isLowStock);
    } else if (productStockFilter === 'outOfStock') {
      list = list.filter((p) => p.isOutOfStock);
    }

    if (productCatalogTab === 'alerts') {
      list = list.filter((p) => p.isLowStock || p.isOutOfStock);
    }

    return list;
  }, [products, productSearch, productCategoryFilter, productSectionFilter, productStockFilter, productCatalogTab]);

  const productStats = useMemo(() => {
    const all = products.length;
    let active = 0;
    let low = 0;
    let out = 0;
    products.forEach((p) => {
      const s = typeof p.stockCount === 'number' ? p.stockCount : (p.inStock !== false ? 200 : 0);
      if (p.inStock !== false && s > 0) active++;
      if (s > 0 && s <= 80) low++;
      if (p.inStock === false || s === 0) out++;
    });
    return { all, active, low, out };
  }, [products]);

  // Product Actions Handlers
  const handleOpenAddProduct = () => {
    const defaultCat = categories && categories.length > 0 ? categories[0] : null;
    setProductFormData({
      id: '',
      name: '',
      slug: '',
      description: '',
      brand: 'UltraTech',
      section: defaultCat?.section || defaultCat?.sectionName || 'Civil & Interiors',
      category: defaultCat ? defaultCat.name : 'Cement',
      categorySlug: defaultCat ? defaultCat.slug : 'cement',
      subcategory: defaultCat && Array.isArray(defaultCat.subcategories) && defaultCat.subcategories.length > 0 ? defaultCat.subcategories[0] : '',
      unit: '50kg Bag',
      mrp: '',
      price: '',
      stockCount: 500,
      minOrderQty: 1,
      gstRate: 18,
      image: '',
      status: 'PUBLISHED',
      isFeatured: true,
    });
    setProductModalTab('general');
    setActiveModal('create-product');
  };

  const handleOpenEditProduct = (prod) => {
    setProductFormData({
      id: prod.id,
      name: prod.name || '',
      slug: prod.slug || '',
      description: prod.description || '',
      brand: prod.brand || 'UltraTech',
      section: prod.section || 'Civil & Interiors',
      category: prod.category || (categories[0]?.name || 'Cement'),
      categorySlug: prod.categorySlug || (categories[0]?.slug || 'cement'),
      subcategory: prod.subcategory || '',
      unit: prod.unit || '50kg Bag',
      mrp: prod.mrp || Math.round((prod.price || 300) * 1.25),
      price: prod.price || 300,
      stockCount: typeof prod.stockCount === 'number' ? prod.stockCount : 500,
      minOrderQty: prod.minOrderQty || 1,
      gstRate: prod.gstRate || 18,
      image: prod.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400',
      status: prod.status || (prod.inStock ? 'PUBLISHED' : 'OUT_OF_STOCK'),
      isFeatured: prod.isFeatured !== undefined ? prod.isFeatured : true,
    });
    setProductModalTab('general');
    setActiveModal('edit-product');
  };

  const handleSaveProduct = (e) => {
    if (e) e.preventDefault();
    if (!productFormData.name || !productFormData.name.trim()) {
      addToast('Please enter a product title', 'warning');
      return;
    }

    const name = productFormData.name.trim();
    const slug = productFormData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const price = Number(productFormData.price) >= 0 && productFormData.price !== '' ? Number(productFormData.price) : 300;
    const mrp = Number(productFormData.mrp) > 0 ? Number(productFormData.mrp) : Math.round(price * 1.25);
    const stockCount = productFormData.stockCount !== '' && productFormData.stockCount !== undefined && !isNaN(productFormData.stockCount) ? Number(productFormData.stockCount) : 500;
    const inStock = productFormData.status !== 'OUT_OF_STOCK' && stockCount > 0;
    const category = productFormData.category || (categories && categories[0]?.name) || 'Cement';
    const foundCat = categories.find((c) => c.name?.toLowerCase() === category.toLowerCase() || c.slug === productFormData.categorySlug);
    const categorySlug = productFormData.categorySlug || foundCat?.slug || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const image = productFormData.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400';

    const productPayload = {
      ...productFormData,
      name,
      slug,
      price,
      mrp,
      stockCount,
      inStock,
      category,
      categorySlug,
      section: foundCat?.section || foundCat?.sectionName || productFormData.section || 'Civil & Interiors',
      brand: productFormData.brand || 'UltraTech',
      unit: productFormData.unit || 'Standard Unit',
      image,
      isFeatured: productFormData.isFeatured !== undefined ? productFormData.isFeatured : true,
      isPopular: true,
    };

    if (activeModal === 'edit-product' && productFormData.id) {
      updateProduct(productFormData.id, productPayload);
      addToast(`Product "${name}" updated successfully!`, 'success');
    } else {
      const newId = `prod_${Date.now()}`;
      addProduct({
        ...productPayload,
        id: newId,
      });
      addToast(`Product "${name}" published to catalog!`, 'success');
    }

    setActiveModal(null);
  };

  // -------------------------------------------------------------
  // Inline Styles & CSS Variables for the Light Blue SaaS Design
  // -------------------------------------------------------------
  const theme = {
    bg: '#EDF4FB',
    sidebarBg: '#E8F2FA',
    sidebarBorder: '#D6E4F0',
    headerBg: '#E8F2FA',
    headerBorder: '#D6E4F0',
    cardBg: '#FFFFFF',
    cardBorder: '#D9E6F2',
    primaryBlue: '#0066FF',
    primaryBlueHover: '#0052CC',
    primaryBlueLight: '#DCEBF8',
    textDark: '#08274C',
    textMuted: '#58738D',
    textSubtle: '#7E9BB5',
    tableBorder: '#E6EFF7',
    tableHeaderBg: '#F3F8FC',
    badgeGreen: '#10B981',
    badgeGreenLight: '#ECFDF5',
    badgeOrange: '#FF6B00',
    badgeOrangeLight: '#FFF7ED',
    badgePurple: '#7C3AED',
    badgePurpleLight: '#F5F3FF',
    badgeBlue: '#0066FF',
    badgeBlueLight: '#EFF6FF',
    badgeRed: '#EF4444',
    badgeRedLight: '#FEF2F2',
  };

  // Local state for Admin Login Form
  const [adminEmailInput, setAdminEmailInput] = useState('admin@gmail.com');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);

  const handleAdminLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setAdminAuthError('');
    setIsAdminSubmitting(true);

    try {
      const res = await adminLogin(adminEmailInput, adminPasswordInput);
      if (!res.success) {
        setAdminAuthError(res.message || 'Invalid administrator email or password');
      }
    } catch (err) {
      setAdminAuthError(err.message || 'Authentication error');
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  const handleAutofillAdmin = () => {
    setAdminEmailInput('admin@gmail.com');
    setAdminPasswordInput('Admin!@#123');
    setAdminAuthError('');
  };

  // -------------------------------------------------------------
  // Exclusive Admin Authentication Gate
  // -------------------------------------------------------------
  if (!adminUser) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#07101E',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(0, 102, 255, 0.18) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(241, 90, 36, 0.15) 0%, transparent 50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      }}>
        {/* Ambient Grid Pattern Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Central Auth Card Container */}
        <div style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#0F1D33',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 102, 255, 0.15)',
          padding: '2.5rem 2.25rem',
          position: 'relative',
          zIndex: 10,
          backdropFilter: 'blur(16px)',
        }}>
          {/* Header & Security Badge */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #0066FF 0%, #0044B3 100%)',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0, 102, 255, 0.35)',
              marginBottom: '1rem',
            }}>
              <ShieldCheck size={34} />
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(241, 90, 36, 0.15)',
              border: '1px solid rgba(241, 90, 36, 0.35)',
              color: '#FF7A45',
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              <Lock size={12} /> RESTRICTED ACCESS • ADMIN ONLY
            </div>

            <h1 style={{
              fontSize: '1.65rem',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 0.4rem 0',
              letterSpacing: '-0.02em',
            }}>
              MISTRI Admin Login
            </h1>
            <p style={{
              fontSize: '0.84rem',
              color: '#94A3B8',
              margin: 0,
              lineHeight: 1.45,
            }}>
              Authorized system administrator access only. Enter root credentials to manage the platform.
            </p>
          </div>

          {/* Quick autofill helper button */}
          <button
            type="button"
            onClick={handleAutofillAdmin}
            style={{
              width: '100%',
              padding: '8px 12px',
              marginBottom: '1.5rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 102, 255, 0.1)',
              border: '1px dashed rgba(0, 102, 255, 0.4)',
              color: '#60A5FA',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 102, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 102, 255, 0.1)'}
          >
            <Sparkles size={14} color="#60A5FA" />
            <span>Click to Autofill Admin: admin@gmail.com</span>
          </button>

          {/* Error Alert Banner */}
          {adminAuthError && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              color: '#FCA5A5',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
              <span>{adminAuthError}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#CBD5E1',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                Administrator Email
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}>
                <Mail
                  size={17}
                  color="#64748B"
                  style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
                />
                <input
                  type="email"
                  required
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  placeholder="admin@gmail.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.65rem',
                    borderRadius: '10px',
                    border: '1px solid #2A3F60',
                    backgroundColor: '#091528',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0066FF'}
                  onBlur={(e) => e.target.style.borderColor = '#2A3F60'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#CBD5E1',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  Admin Password
                </label>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  Admin!@#123
                </span>
              </div>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}>
                <Lock
                  size={17}
                  color="#64748B"
                  style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
                />
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 2.65rem',
                    borderRadius: '10px',
                    border: '1px solid #2A3F60',
                    backgroundColor: '#091528',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0066FF'}
                  onBlur={(e) => e.target.style.borderColor = '#2A3F60'}
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showAdminPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAdminSubmitting}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.85rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '0.03em',
                cursor: isAdminSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(0, 102, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isAdminSubmitting) e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                if (!isAdminSubmitting) e.currentTarget.style.transform = 'none';
              }}
            >
              {isAdminSubmitting ? (
                <>
                  <RefreshCw size={18} style={{ animation: 'spin 0.6s linear infinite' }} />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <Key size={18} />
                  <span>LOG IN TO ADMIN HUB</span>
                </>
              )}
            </button>
          </form>

          {/* Return to Customer Store */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              type="button"
              onClick={() => navigateTo('home')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
            >
              <ArrowLeft size={14} /> Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.textDark,
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      fontSize: '14px',
    }}>
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR NAVIGATION (LIGHT BLUE)                   */}
      {/* ========================================================= */}
      <aside style={{
        width: isSidebarCollapsed ? '72px' : '260px',
        backgroundColor: theme.sidebarBg,
        borderRight: `1px solid ${theme.sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        transition: 'width 0.2s ease',
        flexShrink: 0,
      }}>
        {/* Brand / Logo */}
        <div style={{
          height: '68px',
          padding: isSidebarCollapsed ? '0 0.5rem' : '0 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
          borderBottom: `1px solid ${theme.sidebarBorder}`,
        }}>
          {!isSidebarCollapsed ? (
            <div style={{ cursor: 'pointer' }} onClick={() => handleTabChange('dashboard')}>
              <Logo size="medium" showTagline={true} />
            </div>
          ) : (
            <div
              onClick={() => handleTabChange('dashboard')}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#08274C',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
            >
              M
            </div>
          )}
        </div>

        {/* Navigation Menus with Scrollbar */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.75rem 0.75rem 1.5rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}>
          {sidebarNavGroups.map((grp, gIdx) => (
            <div key={gIdx} style={{ marginBottom: grp.group ? '0.6rem' : '0.2rem' }}>
              {grp.group && !isSidebarCollapsed && (
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: '#607D9B',
                  padding: '0.6rem 0.6rem 0.3rem 0.6rem',
                  textTransform: 'uppercase',
                }}>
                  {grp.group}
                </div>
              )}
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isItemParent = item.isExpandable && item.children;
                const isParentActive = ['categories', 'parent-categories', 'sub-categories', 'category-products'].includes(adminActiveTab);
                const isActive = item.id === 'categories'
                  ? isParentActive
                  : adminActiveTab === item.id;

                if (isItemParent) {
                  return (
                    <div key={item.id} style={{ marginBottom: '4px' }}>
                      <button
                        onClick={() => {
                          setIsCategoryMenuOpen(!isCategoryMenuOpen);
                        }}
                        title={isSidebarCollapsed ? item.label : undefined}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                          padding: isSidebarCollapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                          borderRadius: '9px',
                          backgroundColor: isParentActive ? '#E6F0FA' : 'transparent',
                          color: isParentActive ? theme.primaryBlue : '#1E3A5F',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: isParentActive ? 700 : 500,
                          fontSize: '0.85rem',
                          transition: 'all 0.15s ease',
                          marginBottom: '2px',
                        }}
                        onMouseEnter={(e) => {
                          if (!isParentActive) e.currentTarget.style.backgroundColor = '#DCE8F5';
                        }}
                        onMouseLeave={(e) => {
                          if (!isParentActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Icon size={18} color={isParentActive ? theme.primaryBlue : '#4B6B8A'} />
                          {!isSidebarCollapsed && <span>{item.label}</span>}
                        </div>

                        {!isSidebarCollapsed && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {item.badge && (
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '1px 7px',
                                borderRadius: '12px',
                                backgroundColor: isParentActive ? theme.primaryBlue : '#D2E5F7',
                                color: isParentActive ? '#FFFFFF' : theme.primaryBlue,
                              }}>
                                {item.badge}
                              </span>
                            )}
                            {isCategoryMenuOpen ? (
                              <ChevronDown size={15} color={isParentActive ? theme.primaryBlue : '#4B6B8A'} />
                            ) : (
                              <ChevronRight size={15} color={isParentActive ? theme.primaryBlue : '#4B6B8A'} />
                            )}
                          </div>
                        )}
                      </button>

                      {/* 3 Sub-tabs in Sidebar: All Categories, Parent Categories, Sub Categories */}
                      {isCategoryMenuOpen && !isSidebarCollapsed && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          marginTop: '2px',
                          marginLeft: '12px',
                          paddingLeft: '10px',
                          borderLeft: '2px solid #CBD5E1',
                        }}>
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive = adminActiveTab === child.id || (child.id === 'categories' && adminActiveTab === 'category-products');
                            return (
                              <button
                                key={child.id}
                                onClick={() => handleTabChange(child.id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.45rem 0.65rem',
                                  borderRadius: '7px',
                                  backgroundColor: isChildActive ? theme.primaryBlue : 'transparent',
                                  color: isChildActive ? '#FFFFFF' : '#334155',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontWeight: isChildActive ? 700 : 500,
                                  fontSize: '0.8rem',
                                  transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isChildActive) e.currentTarget.style.backgroundColor = '#E2E8F0';
                                }}
                                onMouseLeave={(e) => {
                                  if (!isChildActive) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <ChildIcon size={14} color={isChildActive ? '#FFFFFF' : '#64748B'} />
                                  <span>{child.label}</span>
                                </div>
                                {child.badge && (
                                  <span style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    padding: '1px 6px',
                                    borderRadius: '10px',
                                    backgroundColor: isChildActive ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                                    color: isChildActive ? '#FFFFFF' : '#475569',
                                  }}>
                                    {child.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                      padding: isSidebarCollapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                      borderRadius: '9px',
                      backgroundColor: isActive ? theme.primaryBlue : 'transparent',
                      color: isActive ? '#FFFFFF' : '#1E3A5F',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.85rem',
                      transition: 'all 0.15s ease',
                      marginBottom: '2px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#DCE8F5';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={18} color={isActive ? '#FFFFFF' : '#4B6B8A'} />
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </div>

                    {!isSidebarCollapsed && item.badge && (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: '12px',
                        backgroundColor: isActive
                          ? 'rgba(255,255,255,0.25)'
                          : item.badgeStyle === 'blue-pill'
                          ? theme.primaryBlue
                          : '#D2E5F7',
                        color: isActive ? '#FFFFFF' : item.badgeStyle === 'blue-pill' ? '#FFFFFF' : theme.primaryBlue,
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Admin Session & Logout Footer */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!isSidebarCollapsed ? (
              <div style={{
                padding: '0.75rem',
                borderRadius: '10px',
                backgroundColor: '#EBF4FD',
                border: '1px solid #D0E2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: theme.primaryBlue,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}>
                    {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#08274C', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {adminUser?.name || 'Administrator'}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: '#64748B', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {adminUser?.email || 'admin@gmail.com'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={adminLogout}
                  title="Logout Admin"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EF4444',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={adminLogout}
                title="Logout Admin"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  margin: '0 auto',
                }}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </nav>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE AREA (WITH LIGHT BLUE HEADER)           */}
      {/* ========================================================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* TOP HEADER BAR (LIGHT BLUE) */}
        <header style={{
          height: '68px',
          backgroundColor: theme.headerBg,
          borderBottom: `1px solid ${theme.headerBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.75rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          {/* Left: Sidebar Toggle & Global Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, maxWidth: '620px' }}>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#335372',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '6px',
              }}
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>

            {/* Global Search Bar */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D0E2F2',
              borderRadius: '10px',
              padding: '0.45rem 0.85rem',
              gap: '8px',
              boxShadow: '0 1px 3px rgba(8, 39, 76, 0.04)',
            }}>
              <Search size={16} color="#7E9BB5" />
              <input
                type="text"
                placeholder="Search products, orders, users, categories..."
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setSearchTerm(e.target.value);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.85rem',
                  color: theme.textDark,
                  width: '100%',
                }}
              />
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#58738D',
                backgroundColor: '#EDF5FC',
                border: '1px solid #D0E2F2',
                padding: '2px 6px',
                borderRadius: '5px',
              }}>
                Ctrl K
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* View Storefront Link */}
            <button
              onClick={() => navigateTo('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.45rem 0.85rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D0E2F2',
                borderRadius: '8px',
                color: '#08274C',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 2px rgba(8, 39, 76, 0.04)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F6FC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              <Store size={15} color="#0066FF" />
              <span>View User Store</span>
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #D0E2F2',
                  borderRadius: '8px',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#335372',
                  position: 'relative',
                  boxShadow: '0 1px 2px rgba(8, 39, 76, 0.04)',
                }}
              >
                <Bell size={18} />
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '17px',
                  height: '17px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                }}>
                  3
                </span>
              </button>
            </div>

            {/* Fullscreen Expand Icon */}
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #D0E2F2',
                borderRadius: '8px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#335372',
                boxShadow: '0 1px 2px rgba(8, 39, 76, 0.04)',
              }}
              title="Toggle Fullscreen"
            >
              <Maximize2 size={16} />
            </button>

            {/* User Profile Chip */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '4px 8px 4px 4px',
                  borderRadius: '24px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D0E2F2',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(8, 39, 76, 0.04)',
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#0066FF',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}>
                  {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textDark }}>{adminUser?.name || 'Root Administrator'}</span>
                  <span style={{ fontSize: '0.68rem', color: theme.textMuted }}>{adminUser?.email || 'admin@gmail.com'}</span>
                </div>
                <ChevronDown size={14} color="#7E9BB5" />
              </div>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D0E2F2',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(8, 39, 76, 0.12)',
                  width: '200px',
                  padding: '0.5rem',
                  zIndex: 100,
                }}>
                  <button
                    onClick={() => { navigateTo('home'); setIsProfileMenuOpen(false); }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'transparent', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#08274C', cursor: 'pointer', borderRadius: '6px' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDF5FC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Store size={15} /> View Storefront
                  </button>
                  <button
                    onClick={() => { handleTabChange('settings'); setIsProfileMenuOpen(false); }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'transparent', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#08274C', cursor: 'pointer', borderRadius: '6px' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDF5FC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Settings size={15} /> Platform Settings
                  </button>
                  <button
                    onClick={() => { resetToDefaultData(); setIsProfileMenuOpen(false); }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'transparent', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#F15A24', cursor: 'pointer', borderRadius: '6px' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFF1EB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <RotateCcw size={15} /> Reset Demo Data
                  </button>
                  <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0' }} />
                  <button
                    onClick={() => { adminLogout(); setIsProfileMenuOpen(false); }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'transparent', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#EF4444', cursor: 'pointer', borderRadius: '6px' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={15} /> Logout Admin
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY: Workspace + Side Inspector Layout */}
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 68px)' }}>
          {/* CENTER VIEW CONTENT */}
          <main style={{ flex: 1, padding: '1.5rem 1.75rem', minWidth: 0, overflowY: 'auto' }}>
            {/* Render Tab Sub-View based on adminActiveTab */}
            {adminActiveTab === 'categories' && renderCategoriesView()}
            {adminActiveTab === 'parent-categories' && renderParentCategoriesView()}
            {adminActiveTab === 'sub-categories' && renderSubCategoriesView()}
            {adminActiveTab === 'dashboard' && renderDashboardView()}
            {adminActiveTab === 'products' && renderProductsView()}
            {adminActiveTab === 'brands' && renderBrandsView()}
            {adminActiveTab === 'attributes' && renderProductsView()}
            {adminActiveTab === 'orders' && renderOrdersView()}
            {adminActiveTab === 'live-tracking' && renderLiveTrackingView()}
            {adminActiveTab === 'customers' && renderUsersView('Customers')}
            {adminActiveTab === 'coupons' && renderCouponsView()}
            {adminActiveTab === 'banners' && renderBannersView()}
            {adminActiveTab === 'bookings' && renderBookingsView()}
            {adminActiveTab === 'services' && renderServicesView()}
            {adminActiveTab === 'quotations' && renderQuotationsView()}
            {adminActiveTab === 'faqs' && renderFaqsView()}
            {adminActiveTab === 'settings' && renderSettingsView()}
            {adminActiveTab === 'admin-users' && renderAdminUsersView()}
            {adminActiveTab === 'system-logs' && renderSystemLogsView()}
          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MODAL DIALOGS (Category, Parent Category, Sub Category) */}
      {/* ========================================================= */}
      {/* Modal 1: Add Category Modal */}
      {activeModal === 'add-category' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '540px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: theme.textDark }}>
                + Add New Category
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const name = modalFormData.name;
                if (!name) return;
                const newCat = {
                  id: `cat_${Date.now()}`,
                  name,
                  slug: modalFormData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  section: modalFormData.section || 'Civil & Interiors',
                  description: modalFormData.description || '',
                  image: modalFormData.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=300',
                  subcategories: modalFormData.subcategoriesText ? modalFormData.subcategoriesText.split(',').map(s => s.trim()).filter(Boolean) : ['Standard Grade', 'Premium Grade'],
                  isActive: true,
                  createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                  lastUpdated: 'Just now',
                };
                addCategory(newCat);
                setActiveModal(null);
                setModalFormData({});
                addToast(`Category "${name}" created successfully!`, 'success');
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: theme.textDark, marginBottom: '0.35rem' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ready Mix Concrete, Structural Steel"
                  value={modalFormData.name || ''}
                  onChange={(e) => setModalFormData({
                    ...modalFormData,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: theme.textDark, marginBottom: '0.35rem' }}>
                  Slug
                </label>
                <input
                  type="text"
                  value={modalFormData.slug || ''}
                  onChange={(e) => setModalFormData({ ...modalFormData, slug: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: theme.textDark, marginBottom: '0.35rem' }}>
                  Parent Category / Section
                </label>
                <select
                  value={modalFormData.section || 'Civil & Interiors'}
                  onChange={(e) => setModalFormData({ ...modalFormData, section: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                >
                  {categorySections.map((sec) => (
                    <option key={sec.id} value={sec.title || sec.name}>
                      {sec.title || sec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product / Category Image Upload */}
              <ImageUploadField
                label="Category & Product Image *"
                value={modalFormData.image || ''}
                onChange={(img) => setModalFormData({ ...modalFormData, image: img })}
                placeholder="Upload image or paste image link"
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: theme.textDark, marginBottom: '0.35rem' }}>
                  Subcategories (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. OPC 53, PPC, White Cement, Fast Setting"
                  value={modalFormData.subcategoriesText || ''}
                  onChange={(e) => setModalFormData({ ...modalFormData, subcategoriesText: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: theme.textDark, marginBottom: '0.35rem' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of materials in this category..."
                  value={modalFormData.description || ''}
                  onChange={(e) => setModalFormData({ ...modalFormData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{
                    padding: '0.6rem 1rem',
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.25rem',
                    backgroundColor: theme.primaryBlue,
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 102, 255, 0.3)',
                  }}
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Parent Category Modal */}
      {activeModal === 'add-parent-category' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: theme.textDark }}>
                + Add Parent Category / Section
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const title = modalFormData.title;
                if (!title) return;
                const newSec = {
                  id: `sec_${Date.now()}`,
                  title,
                  description: modalFormData.description || '',
                  image: modalFormData.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=600',
                  categories: [],
                  isActive: true,
                };
                addCategorySection(newSec);
                setActiveModal(null);
                setModalFormData({});
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: theme.textDark, marginBottom: '0.35rem' }}>
                  Parent Category Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roofing & Insulation, Safety Gear"
                  value={modalFormData.title || ''}
                  onChange={(e) => setModalFormData({ ...modalFormData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Product / Banner Image Upload */}
              <ImageUploadField
                label="Parent Category Banner / Product Image"
                value={modalFormData.image || ''}
                onChange={(img) => setModalFormData({ ...modalFormData, image: img })}
                placeholder="Upload banner image or paste direct URL"
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: theme.textDark, marginBottom: '0.35rem' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Description of department and structural line..."
                  value={modalFormData.description || ''}
                  onChange={(e) => setModalFormData({ ...modalFormData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{
                    padding: '0.6rem 1rem',
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.25rem',
                    backgroundColor: theme.primaryBlue,
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 102, 255, 0.3)',
                  }}
                >
                  Create Parent Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add Sub Category Modal */}
      {activeModal === 'add-sub-category' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: theme.textDark }}>
                + Add Sub Category & Variant Image
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const subName = modalFormData.subName;
                const catId = modalFormData.categoryId || (categories[0] && (categories[0].id || categories[0].slug));
                if (!subName || !catId) return;

                addSubCategory(catId, subName.trim(), modalFormData.image || '');
                setActiveModal(null);
                setModalFormData({});
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: theme.textDark, marginBottom: '0.35rem' }}>
                  Select Main Category *
                </label>
                <select
                  value={modalFormData.categoryId || (categories[0] && (categories[0].id || categories[0].slug))}
                  onChange={(e) => setModalFormData({ ...modalFormData, categoryId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id || c.slug} value={c.id || c.slug}>
                      {c.name} ({c.section || 'Civil & Interiors'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: theme.textDark, marginBottom: '0.35rem' }}>
                  Sub Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OPC 53 Grade, Epoxy Tile Grout, CPVC Brass Elbow"
                  value={modalFormData.subName || ''}
                  onChange={(e) => setModalFormData({ ...modalFormData, subName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Product / Subcategory Image Upload */}
              <ImageUploadField
                label="Sub Category Product / Material Image"
                value={modalFormData.image || ''}
                onChange={(img) => setModalFormData({ ...modalFormData, image: img })}
                placeholder="Upload variant image or choose from samples"
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{
                    padding: '0.6rem 1rem',
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.25rem',
                    backgroundColor: theme.primaryBlue,
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 102, 255, 0.3)',
                  }}
                >
                  Create Sub Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Create / Edit Master Product Modal (Image 2 Reference) */}
      {(activeModal === 'create-product' || activeModal === 'edit-product') && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '860px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(15,23,42,0.2)',
                }}>
                  <Package size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                    {activeModal === 'edit-product' ? 'Edit Master Product' : 'Create Product'}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}>
                      SYSTEM
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>›</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>
                      MASTER CATALOG - {activeModal === 'edit-product' ? 'EDIT' : 'NEW'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  padding: '4px',
                  borderRadius: '6px',
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Quick Stats Top Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr',
              gap: '12px',
              padding: '0.65rem 1.5rem',
              backgroundColor: '#FAFCFE',
              borderBottom: '1px solid #E2E8F0',
              fontSize: '0.75rem',
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>VARIANTS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  {(Number(productFormData.price) > 0 || (productFormData.unit && productFormData.unit.trim())) ? '1' : '0'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>SELL PRICES</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                  {productFormData.price !== '' && productFormData.price !== undefined && !isNaN(productFormData.price) && Number(productFormData.price) > 0
                    ? `₹${Number(productFormData.price).toLocaleString('en-IN')}`
                    : '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>HUB STOCK (H)</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: theme.primaryBlue, marginTop: '2px' }}>
                  {productFormData.stockCount !== '' && productFormData.stockCount !== undefined && !isNaN(productFormData.stockCount) && Number(productFormData.stockCount) >= 0
                    ? Number(productFormData.stockCount).toLocaleString('en-IN')
                    : '—'}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>TIP</div>
                <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Set price & stock on each variant row below.</div>
              </div>
            </div>

            {/* Modal Body with 2-Column Tabs Layout */}
            <div style={{ display: 'flex', flex: 1, minHeight: '380px', maxHeight: '520px', overflow: 'hidden' }}>
              {/* Left Tabs Navigation */}
              <div style={{
                width: '210px',
                backgroundColor: '#F8FAFC',
                borderRight: '1px solid #E2E8F0',
                padding: '1.25rem 0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                flexShrink: 0,
              }}>
                {[
                  { id: 'general', label: 'General Info', icon: Tag },
                  { id: 'categories', label: 'Categories', icon: Layers },
                  { id: 'variants', label: 'Variants & pricing', icon: FileText },
                  { id: 'photos', label: 'Photos', icon: ImageIcon },
                ].map((t) => {
                  const Icon = t.icon;
                  const isTabActive = productModalTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setProductModalTab(t.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: isTabActive ? '#FFFFFF' : 'transparent',
                        color: isTabActive ? '#EF4444' : '#475569',
                        fontWeight: isTabActive ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: isTabActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={16} color={isTabActive ? '#EF4444' : '#64748B'} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                  {/* Status Dropdown */}
                  <div>
                    <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      STATUS
                    </label>
                    <select
                      value={productFormData.status || 'PUBLISHED'}
                      onChange={(e) => setProductFormData({ ...productFormData, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '8px',
                        backgroundColor: productFormData.status === 'PUBLISHED' ? '#ECFDF5' : '#F1F5F9',
                        border: productFormData.status === 'PUBLISHED' ? '1px solid #A7F3D0' : '1px solid #CBD5E1',
                        color: productFormData.status === 'PUBLISHED' ? '#059669' : '#334155',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                    </select>
                  </div>

                  {/* Featured Checkbox */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                  }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em' }}>FEATURED</span>
                    <input
                      type="checkbox"
                      checked={!!productFormData.isFeatured}
                      onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })}
                      style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: theme.primaryBlue }}
                    />
                  </label>
                </div>
              </div>

              {/* Right Content Form Area */}
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                {/* 1. General Info Tab */}
                {productModalTab === 'general' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        PRODUCT TITLE *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UltraTech Super PPC Cement 50kg, Tata Tiscon TMT Rebars"
                        value={productFormData.name || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProductFormData({
                            ...productFormData,
                            name: val,
                            slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                          });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#F8FAFC',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#0F172A',
                          outline: 'none',
                        }}
                      />
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>
                        Slug is auto-generated from the product name on save.
                      </div>
                    </div>

                    {/* Instruction Alert Callout */}
                    <div style={{
                      backgroundColor: '#FEFCE8',
                      border: '1px solid #FEF08A',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      color: '#854D0E',
                      fontSize: '0.78rem',
                      lineHeight: 1.45,
                    }}>
                      Complete <strong>Categories</strong>, then add <strong>Variants & pricing</strong> (sell price + hub stock per size/unit on master catalog).
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        ABOUT THIS ITEM
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe the item here..."
                        value={productFormData.description || ''}
                        onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#F8FAFC',
                          fontSize: '0.85rem',
                          color: '#0F172A',
                          outline: 'none',
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        BRAND NAME
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UltraTech, Tata Tiscon, Asian Paints, Kajaria, Astral"
                        value={productFormData.brand || ''}
                        onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#F8FAFC',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: '#0F172A',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* 2. Categories Tab (Only Parent Category and Sub Category) */}
                {productModalTab === 'categories' && (() => {
                  const activeCatObj = categories.find(
                    (c) => c.name === productFormData.category || c.slug === productFormData.categorySlug
                  );
                  const availableSubs = activeCatObj && Array.isArray(activeCatObj.subcategories) ? activeCatObj.subcategories : [];

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* 1. Parent Category */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                          PARENT CATEGORY *
                        </label>
                        <select
                          value={productFormData.category || ''}
                          onChange={(e) => {
                            const catName = e.target.value;
                            const found = categories.find((c) => c.name === catName);
                            const subs = found && Array.isArray(found.subcategories) ? found.subcategories : [];
                            setProductFormData({
                              ...productFormData,
                              category: catName,
                              categorySlug: found ? found.slug : catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                              section: found?.section || found?.sectionName || 'Civil & Interiors',
                              subcategory: subs.length > 0 ? subs[0] : '',
                            });
                          }}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#F8FAFC',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#0F172A',
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          <option value="">-- Select Parent Category --</option>
                          {categories.map((c) => (
                            <option key={c.id || c.slug} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 2. Sub Category with Dropdown & Scrollable Selector */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            SUB CATEGORY *
                          </label>
                          {availableSubs.length > 0 && (
                            <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                              {availableSubs.length} subcategories available
                            </span>
                          )}
                        </div>

                        {/* Select Dropdown */}
                        <select
                          value={productFormData.subcategory || ''}
                          disabled={!productFormData.category}
                          onChange={(e) => setProductFormData({ ...productFormData, subcategory: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: productFormData.category ? '#F8FAFC' : '#F1F5F9',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: productFormData.category ? '#0F172A' : '#94A3B8',
                            cursor: productFormData.category ? 'pointer' : 'not-allowed',
                            outline: 'none',
                            marginBottom: '8px',
                          }}
                        >
                          <option value="">{productFormData.category ? '-- Select Sub Category --' : '-- Please select a Parent Category first --'}</option>
                          {availableSubs.map((sub, sIdx) => (
                            <option key={sIdx} value={sub}>
                              {sub}
                            </option>
                          ))}
                        </select>

                        {/* Scrollable Subcategory Pill Chips */}
                        {productFormData.category && availableSubs.length > 0 && (
                          <div style={{
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '8px',
                            maxHeight: '130px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                          }}>
                            {availableSubs.map((sub, sIdx) => {
                              const isSelected = productFormData.subcategory === sub;
                              return (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => setProductFormData({ ...productFormData, subcategory: sub })}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    border: isSelected ? `1.5px solid ${theme.primaryBlue}` : '1px solid #CBD5E1',
                                    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                                    color: isSelected ? theme.primaryBlue : '#334155',
                                    transition: 'all 0.15s ease',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  {isSelected && <span>✓</span>}
                                  {sub}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Custom / Exact specification input */}
                        <div style={{ marginTop: '8px' }}>
                          <input
                            type="text"
                            placeholder="Or type custom specification / grade (e.g. OPC 53 Grade, Fe 550D, 600x600mm)"
                            value={productFormData.subcategory || ''}
                            onChange={(e) => setProductFormData({ ...productFormData, subcategory: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.75rem',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FFFFFF',
                              fontSize: '0.78rem',
                              color: '#334155',
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 3. Variants & Pricing Tab */}
                {productModalTab === 'variants' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                        UNIT OF MEASUREMENT / PACKAGING *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 50kg Bag, Metric Ton, 90m Coil, 1 Litre, Pcs, Box, Sq.Ft"
                        value={productFormData.unit || ''}
                        onChange={(e) => setProductFormData({ ...productFormData, unit: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#F8FAFC',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: '#0F172A',
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                          CUSTOMER SELLING PRICE (₹) *
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 375"
                          value={productFormData.price || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#F8FAFC',
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            color: '#10B981',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                          BASE MRP (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 420"
                          value={productFormData.mrp || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, mrp: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#F8FAFC',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: '#64748B',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                          HUB STOCK (AVAILABLE UNITS)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 500"
                          value={productFormData.stockCount || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, stockCount: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#F8FAFC',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: theme.primaryBlue,
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                          MINIMUM ORDER QUANTITY (MOQ)
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 1"
                          value={productFormData.minOrderQty || 1}
                          onChange={(e) => setProductFormData({ ...productFormData, minOrderQty: Number(e.target.value) })}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#F8FAFC',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                          GST TAX RATE (%)
                        </label>
                        <select
                          value={productFormData.gstRate || 18}
                          onChange={(e) => setProductFormData({ ...productFormData, gstRate: Number(e.target.value) })}
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#F8FAFC',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                          }}
                        >
                          <option value={18}>18% GST (Standard)</option>
                          <option value={28}>28% GST (Heavy Materials)</option>
                          <option value={12}>12% GST</option>
                          <option value={5}>5% GST</option>
                          <option value={0}>0% No GST</option>
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                          ESTIMATED HUB MARGIN
                        </div>
                        <div style={{
                          padding: '0.55rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          color: '#059669',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                        }}>
                          ₹{Math.max(0, (Number(productFormData.mrp) || 0) - (Number(productFormData.price) || 0))} ({productFormData.mrp ? Math.round(((Math.max(0, Number(productFormData.mrp) - Number(productFormData.price))) / Number(productFormData.mrp)) * 100) : 0}% discount off MRP)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Photos Tab */}
                {productModalTab === 'photos' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <ImageUploadField
                      label="Primary Product / Material Photo *"
                      value={productFormData.image || ''}
                      onChange={(img) => setProductFormData({ ...productFormData, image: img })}
                      placeholder="Upload product photo or select from high-res presets"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{
              padding: '0.85rem 1.5rem',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              backgroundColor: '#FFFFFF',
            }}>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{
                  padding: '0.6rem 1.25rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                CLOSE
              </button>

              {productModalTab !== 'photos' ? (
                <button
                  type="button"
                  onClick={() => {
                    const order = ['general', 'categories', 'variants', 'photos'];
                    const curIdx = order.indexOf(productModalTab);
                    if (curIdx < order.length - 1) setProductModalTab(order[curIdx + 1]);
                  }}
                  style={{
                    padding: '0.6rem 1.5rem',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 6px rgba(15,23,42,0.25)',
                  }}
                >
                  NEXT
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  style={{
                    padding: '0.6rem 1.5rem',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 6px rgba(15,23,42,0.25)',
                  }}
                >
                  {activeModal === 'edit-product' ? 'SAVE CHANGES' : 'PUBLISH TO CATALOG'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // =============================================================
  // SUB-VIEW RENDERERS
  // =============================================================

  // -------------------------------------------------------------
  // 1. ALL CATEGORIES VIEW (Category Hierarchy 2-Column View matching Reference Image)
  // -------------------------------------------------------------
  function renderCategoriesView() {
    // Parent categories list
    const filteredParents = categories.filter((cat) => {
      const q = hierarchyParentSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        cat.name?.toLowerCase().includes(q) ||
        cat.slug?.toLowerCase().includes(q) ||
        cat.section?.toLowerCase().includes(q)
      );
    });

    const activeParent = selectedHierarchyParent || categories[0] || null;
    const subList = activeParent && Array.isArray(activeParent.subcategories)
      ? activeParent.subcategories.map((subName) => {
          const subImg =
            (activeParent.subcategoryImages && activeParent.subcategoryImages[subName]) ||
            activeParent.image ||
            'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=300';
          const skuCount = products.filter(
            (p) =>
              p.categorySlug === activeParent.slug ||
              p.category?.toLowerCase() === activeParent.name?.toLowerCase() ||
              p.name?.toLowerCase().includes(subName.toLowerCase())
          ).length || 6;
          return {
            name: subName,
            image: subImg,
            skuCount,
          };
        })
      : [];

    const totalHierarchyItems = categories.length + allSubCategories.length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Header Card (Matches Reference Image) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '1.15rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#F5F3FF',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Layers size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Category hierarchy
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.82rem', margin: 0, marginTop: '2px' }}>
                Parent categories and their subcategories ({totalHierarchyItems} items)
              </p>
            </div>
          </div>

          {/* Right Status Badges & Quick Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.85rem',
              borderRadius: '20px',
              backgroundColor: '#EEF2FF',
              border: '1px solid #E0E7FF',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#4338CA',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4F46E5' }} />
              Parents: <strong>{categories.length}</strong>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.85rem',
              borderRadius: '20px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #D1FAE5',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#047857',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              Subcategories: <strong>{allSubCategories.length}</strong>
            </div>

            <button
              onClick={() => setActiveModal('add-category')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.5rem 1rem',
                backgroundColor: theme.primaryBlue,
                color: '#FFFFFF',
                borderRadius: '9px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 102, 255, 0.25)',
              }}
            >
              <Plus size={15} /> Add Category
            </button>
          </div>
        </div>

        {/* 2-Column Split: Parent categories (Left) & Subcategories (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.25rem', alignItems: 'flex-start' }}>
          {/* LEFT CARD: Parent categories List */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Left Header */}
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>
                <Grid size={16} color="#475569" /> Parent categories
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: '#F1F5F9',
                color: '#475569',
              }}>
                {filteredParents.length}
              </span>
            </div>

            {/* Filter parents search box */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                gap: '8px',
              }}>
                <Search size={14} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Filter parents..."
                  value={hierarchyParentSearch}
                  onChange={(e) => setHierarchyParentSearch(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.82rem',
                    color: '#0F172A',
                    width: '100%',
                  }}
                />
                {hierarchyParentSearch && (
                  <X size={14} color="#94A3B8" style={{ cursor: 'pointer' }} onClick={() => setHierarchyParentSearch('')} />
                )}
              </div>
            </div>

            {/* Scrollable Parent Items */}
            <div style={{ maxHeight: '560px', overflowY: 'auto' }}>
              {filteredParents.map((cat) => {
                const isSelected = activeParent && (activeParent.id === cat.id || activeParent.slug === cat.slug);
                const subCount = Array.isArray(cat.subcategories) ? cat.subcategories.length : 4;
                return (
                  <div
                    key={cat.id || cat.slug}
                    onClick={() => setSelectedHierarchyParent(cat)}
                    style={{
                      padding: '0.75rem 1.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #F8FAFC',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#F1F7FE' : 'transparent',
                      borderLeft: isSelected ? `3px solid ${theme.primaryBlue}` : '3px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        flexShrink: 0,
                      }}>
                        <img src={cat.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=200'} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontWeight: isSelected ? 800 : 700,
                          color: isSelected ? theme.primaryBlue : '#0F172A',
                          fontSize: '0.84rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {cat.name}
                        </div>
                        <div style={{
                          fontSize: '0.68rem',
                          color: '#64748B',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          marginTop: '2px',
                        }}>
                          {cat.slug ? cat.slug.toUpperCase().replace(/_/g, '-') : 'GENERAL'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>
                        {subCount}
                      </span>
                      <ChevronRight size={16} color={isSelected ? theme.primaryBlue : '#CBD5E1'} />
                    </div>
                  </div>
                );
              })}

              {filteredParents.length === 0 && (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
                  No parent categories match "{hierarchyParentSearch}"
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CARD: Subcategories of selected parent */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '480px',
            overflow: 'hidden',
          }}>
            {/* Right Header with Green Tag Pill */}
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>
                <span style={{ width: '4px', height: '18px', borderRadius: '4px', backgroundColor: '#10B981', display: 'inline-block' }} />
                <Tag size={16} color="#10B981" /> Subcategories
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                }}>
                  {subList.length}
                </span>

                {activeParent && (
                  <button
                    onClick={() => {
                      setModalFormData({ categoryId: activeParent.id || activeParent.slug });
                      setActiveModal('add-sub-category');
                    }}
                    style={{
                      padding: '0.35rem 0.75rem',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      color: theme.primaryBlue,
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={13} /> Add Subcategory
                  </button>
                )}
              </div>
            </div>

            {/* Content Area */}
            {!activeParent ? (
              /* Empty State when no parent is selected */
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1.5rem',
                color: '#94A3B8',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  <ChevronRight size={32} color="#CBD5E1" />
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#475569' }}>
                  Select a parent category
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>
                  Click on any parent category on the left to view and manage its subcategories
                </div>
              </div>
            ) : (
              /* Selected Parent Content Area */
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Parent Summary Header Banner */}
                <div style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid #CBD5E1',
                    }}>
                      <img src={activeParent.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=200'} alt={activeParent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                        {activeParent.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        Department: <strong>{activeParent.section || 'Civil & Interiors'}</strong> • {subList.length} subcategories
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const newImg = window.prompt(`Enter cover image URL for "${activeParent.name}":`, activeParent.image);
                        if (newImg) updateCategory(activeParent.id || activeParent.slug, { image: newImg });
                      }}
                      style={{
                        padding: '0.4rem 0.75rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        color: '#334155',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <UploadCloud size={13} color={theme.primaryBlue} /> Change Cover
                    </button>
                  </div>
                </div>

                {/* Subcategories List / Grid */}
                <div style={{
                  padding: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '12px',
                  maxHeight: '520px',
                  overflowY: 'auto',
                }}>
                  {subList.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        padding: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* Subcategory Image */}
                      <div style={{
                        position: 'relative',
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        flexShrink: 0,
                      }}>
                        <img src={sub.image} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.84rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, marginTop: '2px' }}>
                          {sub.skuCount} linked items
                        </div>

                        {/* Quick Action Links */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const newImg = window.prompt(`Update product image URL for subcategory "${sub.name}":`, sub.image);
                              if (newImg !== null) {
                                updateSubCategory(activeParent.id || activeParent.slug, sub.name, sub.name, newImg);
                              }
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: theme.primaryBlue,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <UploadCloud size={11} /> Photo
                          </button>
                          <span style={{ color: '#CBD5E1', fontSize: '0.7rem' }}>•</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newName = window.prompt(`Rename subcategory:`, sub.name);
                              if (newName && newName.trim()) {
                                updateSubCategory(activeParent.id || activeParent.slug, sub.name, newName.trim(), sub.image);
                              }
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748B',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            Rename
                          </button>
                          <span style={{ color: '#CBD5E1', fontSize: '0.7rem' }}>•</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete subcategory "${sub.name}" from ${activeParent.name}?`)) {
                                deleteSubCategory(activeParent.id || activeParent.slug, sub.name);
                              }
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {subList.length === 0 && (
                    <div style={{
                      gridColumn: '1 / -1',
                      padding: '2.5rem 1rem',
                      textAlign: 'center',
                      color: '#94A3B8',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px dashed #CBD5E1',
                    }}>
                      <Tag size={28} style={{ marginBottom: '6px', opacity: 0.5 }} />
                      <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.88rem' }}>No subcategories found in {activeParent.name}</div>
                      <button
                        onClick={() => {
                          setModalFormData({ categoryId: activeParent.id || activeParent.slug });
                          setActiveModal('add-sub-category');
                        }}
                        style={{
                          marginTop: '8px',
                          padding: '0.45rem 1rem',
                          backgroundColor: theme.primaryBlue,
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        + Add First Subcategory
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------  // -------------------------------------------------------------
  // 2. PARENT CATEGORIES VIEW (All Primary Parent Categories)
  // -------------------------------------------------------------
  function renderParentCategoriesView() {
    let filteredParents = categories.filter((cat) => {
      const q = parentCategorySearch.toLowerCase().trim();
      const matchQuery =
        !q ||
        (cat.name || '').toLowerCase().includes(q) ||
        (cat.slug || '').toLowerCase().includes(q) ||
        (cat.section || cat.sectionName || '').toLowerCase().includes(q) ||
        (cat.description || '').toLowerCase().includes(q);
      const matchStatus =
        parentCategoryStatusFilter === 'All' ||
        (parentCategoryStatusFilter === 'Active' ? cat.isActive !== false : cat.isActive === false);
      return matchQuery && matchStatus;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Breadcrumb & Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: theme.textMuted, marginBottom: '0.35rem' }}>
              <span onClick={() => handleTabChange('dashboard')} style={{ cursor: 'pointer' }}>Home</span>
              <span>›</span>
              <span>Catalog</span>
              <span>›</span>
              <span style={{ color: theme.primaryBlue, fontWeight: 600 }}>Parent Categories</span>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark, margin: '0 0 0.2rem 0' }}>
              Parent Categories ({categories.length})
            </h1>
            <p style={{ color: theme.textMuted, fontSize: '0.85rem', margin: 0 }}>
              Primary parent material categories and high-level construction departments.
            </p>
          </div>

          <button
            onClick={() => {
              setModalFormData({});
              setActiveModal('add-category');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.6rem 1.25rem',
              backgroundColor: theme.primaryBlue,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 102, 255, 0.25)',
            }}
          >
            <Plus size={16} /> + Add Parent Category
          </button>
        </div>

        {/* TOP LEVEL CATEGORY TABS (All Categories | Parent Categories | Sub Categories) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#FFFFFF',
          padding: '0.4rem 0.5rem',
          borderRadius: '10px',
          border: `1px solid ${theme.cardBorder}`,
          width: 'fit-content',
        }}>
          <button
            onClick={() => handleTabChange('categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: theme.textDark,
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <Grid size={15} color="#64748B" /> All Categories ({categories.length})
          </button>
          <button
            onClick={() => handleTabChange('parent-categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: theme.primaryBlue,
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <FolderTree size={15} /> Parent Categories ({categories.length})
          </button>
          <button
            onClick={() => handleTabChange('sub-categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: theme.textDark,
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <Tag size={15} color="#64748B" /> Sub Categories ({allSubCategories.length})
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: `1px solid ${theme.cardBorder}`,
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.45rem 0.75rem',
            gap: '8px',
            minWidth: '240px',
            flex: 1,
            maxWidth: '380px',
          }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search parent categories by name, slug, department..."
              value={parentCategorySearch}
              onChange={(e) => setParentCategorySearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.82rem',
                color: theme.textDark,
                width: '100%',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={parentCategoryStatusFilter}
              onChange={(e) => setParentCategoryStatusFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '0.8rem',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Parent Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredParents.map((cat, idx) => {
            const subs = Array.isArray(cat.subcategories) ? cat.subcategories : ['Standard Grade', 'Premium Grade'];
            const subCount = subs.length;
            const catImg = cat.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400';
            const prodCount = products.filter(
              (p) =>
                p.categorySlug === cat.slug ||
                p.category?.toLowerCase() === cat.name?.toLowerCase()
            ).length || [128, 86, 54, 42, 118, 76, 132, 64, 58, 49][idx % 10] || 50;

            return (
              <div
                key={cat.id || cat.slug}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: `1px solid ${theme.cardBorder}`,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div style={{ position: 'relative', height: '140px', backgroundColor: '#F8FAFC' }}>
                  <img src={catImg} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, transparent 65%)',
                  }} />
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: cat.isActive !== false ? '#ECFDF5' : '#F1F5F9',
                      color: cat.isActive !== false ? '#047857' : '#64748B',
                      border: `1px solid ${cat.isActive !== false ? '#A7F3D0' : '#CBD5E1'}`,
                    }}>
                      {cat.isActive !== false ? '● ACTIVE' : '○ INACTIVE'}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '10px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>{cat.name}</h3>
                      <div style={{ fontSize: '0.72rem', color: '#CBD5E1', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px' }}>
                        {cat.slug ? cat.slug.toUpperCase().replace(/_/g, '-') : 'GENERAL'}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newImg = window.prompt(`Enter new banner/product image URL for "${cat.name}":`, catImg);
                        if (newImg) updateCategory(cat.id || cat.slug, { image: newImg });
                      }}
                      style={{
                        padding: '4px 9px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: theme.textDark,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <UploadCloud size={12} color={theme.primaryBlue} /> Upload
                    </button>
                  </div>
                </div>

                <div style={{ padding: '1.15rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#EFF6FF',
                      color: theme.primaryBlue,
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}>
                      {cat.section || cat.sectionName || 'Civil & Interiors'}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                      👥 {prodCount} products
                    </span>
                  </div>

                  {cat.description && (
                    <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                      {cat.description}
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                      Subcategories ({subCount}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {subs.slice(0, 4).map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            color: '#334155',
                            padding: '2px 7px',
                            borderRadius: '5px',
                            fontWeight: 600,
                          }}
                        >
                          {sub}
                        </span>
                      ))}
                      {subs.length > 4 && (
                        <span style={{ fontSize: '0.7rem', color: '#64748B', padding: '2px 4px', fontWeight: 700 }}>
                          +{subs.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                  }}>
                    <button
                      onClick={() => {
                        setSelectedHierarchyParent(cat);
                        handleTabChange('categories');
                      }}
                      style={{
                        padding: '0.35rem 0.7rem',
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '6px',
                        color: theme.primaryBlue,
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Layers size={12} /> Hierarchy View
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setModalFormData({ categoryId: cat.id || cat.slug });
                          setActiveModal('add-sub-category');
                        }}
                        style={{
                          padding: '0.35rem 0.7rem',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          color: '#334155',
                          fontSize: '0.73rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        + Subcategory
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete parent category "${cat.name}"?`)) {
                            deleteCategory(cat.id || cat.slug);
                            addToast(`Parent category ${cat.name} removed`, 'info');
                          }
                        }}
                        style={{
                          padding: '0.35rem 0.55rem',
                          backgroundColor: '#FEF2F2',
                          border: '1px solid #FCA5A5',
                          borderRadius: '6px',
                          color: '#EF4444',
                          cursor: 'pointer',
                        }}
                        title="Delete parent category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredParents.length === 0 && (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94A3B8', backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
            <FolderTree size={36} color="#CBD5E1" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, color: '#475569' }}>No parent categories found</div>
            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try searching with a different keyword</div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. SUB CATEGORIES VIEW (Granular specifications & image upload)
  // -------------------------------------------------------------
  function renderSubCategoriesView() {
    let filteredSubs = allSubCategories.filter((sub) => {
      const q = subCategorySearch.toLowerCase();
      const matchQuery = !q || sub.name.toLowerCase().includes(q) || sub.categoryName.toLowerCase().includes(q) || sub.sectionName.toLowerCase().includes(q);
      const matchParent = subCategoryParentFilter === 'All' || sub.sectionName === subCategoryParentFilter;
      const matchMain = subCategoryMainFilter === 'All' || sub.categoryName === subCategoryMainFilter;
      return matchQuery && matchParent && matchMain;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Breadcrumb & Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: theme.textMuted, marginBottom: '0.35rem' }}>
              <span onClick={() => handleTabChange('dashboard')} style={{ cursor: 'pointer' }}>Home</span>
              <span>›</span>
              <span>Catalog</span>
              <span>›</span>
              <span style={{ color: theme.primaryBlue, fontWeight: 600 }}>Sub Categories</span>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark, margin: '0 0 0.2rem 0' }}>
              Sub Categories & Product Images
            </h1>
            <p style={{ color: theme.textMuted, fontSize: '0.85rem', margin: 0 }}>
              Specific grades, material dimensions, and uploaded product images for accurate ordering.
            </p>
          </div>

          <button
            onClick={() => {
              setModalFormData({});
              setActiveModal('add-sub-category');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.6rem 1.25rem',
              backgroundColor: theme.primaryBlue,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 102, 255, 0.25)',
            }}
          >
            <Plus size={16} /> + Add Sub Category
          </button>
        </div>

        {/* TOP LEVEL CATEGORY TABS (All Categories | Parent Categories | Sub Categories) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#FFFFFF',
          padding: '0.4rem 0.5rem',
          borderRadius: '10px',
          border: `1px solid ${theme.cardBorder}`,
          width: 'fit-content',
        }}>
          <button
            onClick={() => handleTabChange('categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: theme.textDark,
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <Grid size={15} color="#64748B" /> All Categories ({categories.length})
          </button>
          <button
            onClick={() => handleTabChange('parent-categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: theme.textDark,
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <FolderTree size={15} color="#64748B" /> Parent Categories ({categories.length})
          </button>
          <button
            onClick={() => handleTabChange('sub-categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: theme.primaryBlue,
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <Tag size={15} /> Sub Categories ({allSubCategories.length})
          </button>
        </div>

        {/* Search & Filters */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: `1px solid ${theme.cardBorder}`,
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.45rem 0.75rem',
            gap: '8px',
            minWidth: '240px',
            flex: 1,
            maxWidth: '300px',
          }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search sub categories..."
              value={subCategorySearch}
              onChange={(e) => setSubCategorySearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.82rem',
                color: theme.textDark,
                width: '100%',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              value={subCategoryParentFilter}
              onChange={(e) => setSubCategoryParentFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '0.8rem',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Parent Sections</option>
              {categorySections.map((s) => (
                <option key={s.id} value={s.title || s.name}>{s.title || s.name}</option>
              ))}
            </select>

            <select
              value={subCategoryMainFilter}
              onChange={(e) => setSubCategoryMainFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '0.8rem',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Main Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subcategories Table */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: theme.tableHeaderBg, borderBottom: `1px solid ${theme.sidebarBorder}`, color: '#64748B' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Subcategory & Product Image</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Main Category</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Parent Department</th>
                <th style={{ padding: '0.75rem 0.85rem', fontWeight: 700, textAlign: 'center' }}>Matching SKUs</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map((sub, idx) => (
                <tr key={sub.id || idx} style={{ borderBottom: `1px solid ${theme.tableBorder}` }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative', width: '42px', height: '42px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', flexShrink: 0 }}>
                        <img src={sub.image} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: theme.textDark, fontSize: '0.85rem' }}>{sub.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Verified specification</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ backgroundColor: '#EFF6FF', color: theme.primaryBlue, fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                      {sub.categoryName}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600 }}>
                    {sub.sectionName}
                  </td>
                  <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center', fontWeight: 700, color: '#334155' }}>
                    {sub.prodCount} items
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#10B981', fontWeight: 700, fontSize: '0.72rem' }}>
                      Active
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <button
                        onClick={() => {
                          const newUrl = window.prompt(`Enter new image URL or paste image link for "${sub.name}":`, sub.image);
                          if (newUrl !== null) {
                            updateSubCategory(sub.categoryId || sub.categorySlug, sub.name, sub.name, newUrl);
                          }
                        }}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: theme.primaryBlue,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <UploadCloud size={12} /> Image
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete subcategory "${sub.name}" from ${sub.categoryName}?`)) {
                            deleteSubCategory(sub.categoryId || sub.categorySlug, sub.name);
                          }
                        }}
                        style={{
                          padding: '4px 6px',
                          backgroundColor: '#FEF2F2',
                          border: '1px solid #FCA5A5',
                          borderRadius: '6px',
                          color: '#EF4444',
                          cursor: 'pointer',
                        }}
                        title="Delete subcategory"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. DASHBOARD VIEW (Analytics & KPI Cards)
  // -------------------------------------------------------------
  function renderDashboardView() {
    const totalRev = orders.reduce((acc, o) => acc + (o.grandTotal || o.total || 0), 0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: theme.textMuted, marginBottom: '0.2rem' }}>
            <span>Home</span> › <span style={{ color: theme.primaryBlue, fontWeight: 600 }}>Dashboard & Analytics</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>
            Executive Dashboard
          </h1>
          <p style={{ color: theme.textMuted, fontSize: '0.85rem' }}>
            Real-time sales velocity, logistics fleet metrics, and technician fulfillment telemetry.
          </p>
        </div>

        {/* Top KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <DollarSign size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.textMuted }}>Total Material Revenue</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.textDark }}>₹{totalRev.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>↑ +18.4% this week</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.primaryBlue }}>
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.textMuted }}>Total Orders</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.textDark }}>{orders.length} Orders</div>
              <div style={{ fontSize: '0.72rem', color: '#0066FF', fontWeight: 700 }}>60-min express active</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B00' }}>
              <Wrench size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.textMuted }}>Active Mistris</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.textDark }}>{mistris.filter(m => m.isAvailable).length} Available</div>
              <div style={{ fontSize: '0.72rem', color: '#FF6B00', fontWeight: 700 }}>100% verified & insured</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: theme.textMuted }}>Registered Customers</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.textDark }}>{usersList.length} Accounts</div>
              <div style={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: 700 }}>Active accounts</div>
            </div>
          </div>
        </div>

        {/* Quick Launch & Recent Orders */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: theme.textDark }}>Recent Dispatch Queue</h3>
              <button onClick={() => handleTabChange('orders')} style={{ color: theme.primaryBlue, fontWeight: 700, fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: theme.textDark, fontSize: '0.85rem' }}>{o.orderNumber || o.id}</div>
                    <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>{o.shippingAddress?.fullName || 'Er. Rajesh Malviya'} • {o.items?.length || 2} items</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#10B981', fontSize: '0.85rem' }}>₹{(o.grandTotal || o.total || 0).toLocaleString('en-IN')}</div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: theme.primaryBlue, backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '10px' }}>
                      {o.status || 'Confirmed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: theme.textDark }}>Quick Actions</h3>
            <button onClick={() => handleTabChange('products')} style={{ padding: '0.65rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: theme.textDark, fontWeight: 700, fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} color={theme.primaryBlue} /> + Manage Products & Stock
            </button>
            <button onClick={() => handleTabChange('categories')} style={{ padding: '0.65rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: theme.textDark, fontWeight: 700, fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="#7C3AED" /> + Edit Categories & Sections
            </button>
            <button onClick={() => handleTabChange('coupons')} style={{ padding: '0.65rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: theme.textDark, fontWeight: 700, fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={16} color="#FF6B00" /> + Create Promo Code
            </button>
            <button onClick={() => handleTabChange('quotations')} style={{ padding: '0.65rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: theme.textDark, fontWeight: 700, fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquareQuote size={16} color="#10B981" /> + Review Project BOQ Quotes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. PRODUCTS VIEW (Master Product Catalog matching Image 1)
  // -------------------------------------------------------------
  function renderProductsView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Header Row with Title, Live Badge, Subtitle & Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.2rem' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Product List
              </h1>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
                border: '1px solid #A7F3D0',
              }}>
                LIVE
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>
              Track your items, prices, and how many are left in stock.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => {
                setIsRefreshingProducts(true);
                setTimeout(() => {
                  setIsRefreshingProducts(false);
                  addToast('Product catalog synchronized with live inventory', 'info');
                }, 400);
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease',
              }}
              title="Refresh Catalog"
            >
              <RefreshCw size={17} style={{ animation: isRefreshingProducts ? 'spin 0.6s linear infinite' : 'none' }} />
            </button>

            {/* + ADD MASTER PRODUCT Button */}
            <button
              type="button"
              onClick={handleOpenAddProduct}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.25rem',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              <Plus size={16} /> + ADD MASTER PRODUCT
            </button>
          </div>
        </div>

        {/* Switcher Navigation Tabs */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#FFFFFF',
          padding: '4px 6px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          width: 'fit-content',
        }}>
          <button
            onClick={() => setProductCatalogTab('master')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 1rem',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: productCatalogTab === 'master' ? '#EFF6FF' : 'transparent',
              color: productCatalogTab === 'master' ? theme.primaryBlue : '#64748B',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <CheckCircle size={14} color={productCatalogTab === 'master' ? theme.primaryBlue : '#94A3B8'} />
            <span>MASTER CATALOG</span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '6px',
              backgroundColor: '#DBEAFE',
              color: theme.primaryBlue,
            }}>
              LIVE APP
            </span>
          </button>

          <button
            onClick={() => setProductCatalogTab('seller')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 1rem',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: productCatalogTab === 'seller' ? '#EFF6FF' : 'transparent',
              color: productCatalogTab === 'seller' ? theme.primaryBlue : '#64748B',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Store size={14} color={productCatalogTab === 'seller' ? theme.primaryBlue : '#94A3B8'} />
            <span>SELLER INVENTORY</span>
          </button>

          <button
            onClick={() => setProductCatalogTab('alerts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 1rem',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: productCatalogTab === 'alerts' ? '#FFF1F2' : 'transparent',
              color: productCatalogTab === 'alerts' ? '#E11D48' : '#64748B',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <AlertTriangle size={14} color={productCatalogTab === 'alerts' ? '#E11D48' : '#94A3B8'} />
            <span>LOW STOCK ALERTS</span>
            {(productStats.low + productStats.out) > 0 && (
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '6px',
                backgroundColor: '#FFE4E6',
                color: '#E11D48',
              }}>
                {productStats.low + productStats.out}
              </span>
            )}
          </button>
        </div>

        {/* 4 Summary / KPI Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {/* Card 1: All Items */}
          <div
            onClick={() => setProductStockFilter('All')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: productStockFilter === 'All' ? '2px solid #F87171' : '1px solid #E2E8F0',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              boxShadow: productStockFilter === 'All' ? '0 4px 12px rgba(248, 113, 113, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#F5F3FF',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Package size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B' }}>All Items</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                {productStats.all}
              </div>
            </div>
          </div>

          {/* Card 2: Active Items */}
          <div
            onClick={() => setProductStockFilter('inStock')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: productStockFilter === 'inStock' ? '2px solid #10B981' : '1px solid #E2E8F0',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              boxShadow: productStockFilter === 'inStock' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B' }}>Active Items</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                {productStats.active}
              </div>
            </div>
          </div>

          {/* Card 3: Low Stock */}
          <div
            onClick={() => setProductStockFilter('lowStock')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: productStockFilter === 'lowStock' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              boxShadow: productStockFilter === 'lowStock' ? '0 4px 12px rgba(245, 158, 11, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#FFFBEB',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B' }}>Low Stock</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                {productStats.low}
              </div>
            </div>
          </div>

          {/* Card 4: Out of Stock */}
          <div
            onClick={() => setProductStockFilter('outOfStock')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: productStockFilter === 'outOfStock' ? '2px solid #EF4444' : '1px solid #E2E8F0',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              boxShadow: productStockFilter === 'outOfStock' ? '0 4px 12px rgba(239, 68, 68, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#FEF2F2',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Package size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B' }}>Out of Stock</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                {productStats.out}
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter & Quick Options Strip */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '0.55rem 0.85rem',
            gap: '10px',
            minWidth: '260px',
            flex: 1,
            maxWidth: '380px',
          }}>
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.85rem',
                color: '#0F172A',
                width: '100%',
              }}
            />
            {productSearch && (
              <X
                size={15}
                color="#94A3B8"
                style={{ cursor: 'pointer' }}
                onClick={() => setProductSearch('')}
              />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Category Dropdown */}
            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Parent Section Filter */}
            <select
              value={productSectionFilter}
              onChange={(e) => setProductSectionFilter(e.target.value)}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="All">All Parent Departments</option>
              {categorySections.map((s) => (
                <option key={s.id} value={s.title || s.name}>{s.title || s.name}</option>
              ))}
            </select>

            {/* Show All / Reset Filters */}
            <button
              type="button"
              onClick={() => {
                setProductSearch('');
                setProductCategoryFilter('All');
                setProductSectionFilter('All');
                setProductStockFilter('All');
                setProductCatalogTab('master');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.55rem 0.95rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                backgroundColor: (productSearch || productCategoryFilter !== 'All' || productSectionFilter !== 'All' || productStockFilter !== 'All') ? '#EFF6FF' : '#FFFFFF',
                color: (productSearch || productCategoryFilter !== 'All' || productSectionFilter !== 'All' || productStockFilter !== 'All') ? theme.primaryBlue : '#475569',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              <Filter size={14} /> SHOW ALL
            </button>
          </div>
        </div>

        {/* Master Catalog Products Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>PRODUCT</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>SELLER</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>VARIANT</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>CATEGORY</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>CUSTOMER PRICE</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#059669' }}>HUB MARGIN</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>STOCK</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFCFE'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* 1. PRODUCT (Thumbnail + Title + Spec) */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            position: 'relative',
                            width: '46px',
                            height: '46px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            backgroundColor: '#F1F5F9',
                            border: '1px solid #E2E8F0',
                            flexShrink: 0,
                          }}>
                            <img
                              src={p.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=200'}
                              alt={p.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.85rem', lineHeight: 1.3, maxWidth: '240px' }}>
                              {p.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                              {p.brand} • {p.unit || 'Standard Unit'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. SELLER (• Hub Catalog) */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: theme.primaryBlue, display: 'inline-block' }} />
                          <span style={{ fontWeight: 700, color: '#334155', fontSize: '0.8rem' }}>
                            {p.seller || 'Hub Catalog'}
                          </span>
                        </div>
                      </td>

                      {/* 3. VARIANT */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ color: '#7C3AED' }}>
                            <FileText size={15} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#7C3AED', fontSize: '0.78rem' }}>
                              {p.optionsCount ? `${p.optionsCount} Options` : '1 Variant'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                              ₹{p.price?.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 4. CATEGORY */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div>
                          <span style={{
                            display: 'inline-block',
                            backgroundColor: '#F1F5F9',
                            color: '#334155',
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                          }}>
                            {p.category}
                          </span>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '3px' }}>
                            {p.subcategory || p.section || 'General'}
                          </div>
                        </div>
                      </td>

                      {/* 5. CUSTOMER PRICE */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                              ₹{p.mrp?.toLocaleString('en-IN')}
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10B981' }}>
                              ₹{p.price?.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '2px' }}>
                            {p.gstRate ? `incl. ${p.gstRate}% GST` : 'No GST'}
                          </div>
                        </div>
                      </td>

                      {/* 6. HUB MARGIN */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{
                          display: 'inline-flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          backgroundColor: '#ECFDF5',
                          border: '1px solid #D1FAE5',
                        }}>
                          <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.78rem' }}>
                            ₹{p.marginAmount?.toLocaleString('en-IN') || '45'}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 700 }}>
                            {p.marginPercent || 10}% margin
                          </span>
                        </div>
                      </td>

                      {/* 7. STOCK (HA, HR, SA, SC Pills) */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', maxWidth: '160px' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#EFF6FF',
                            color: '#1D4ED8',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                          }}>
                            HA <strong>{p.haStock}</strong>
                          </span>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                          }}>
                            HR <strong>{p.hrStock}</strong>
                          </span>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#FAF5FF',
                            color: '#7E22CE',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                          }}>
                            SA <strong>{p.saStock}</strong>
                          </span>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#FFFBEB',
                            color: '#B45309',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                          }}>
                            SC <strong>{p.scStock}</strong>
                          </span>
                        </div>
                      </td>

                      {/* 8. ACTIONS */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(p)}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              borderRadius: '6px',
                              color: '#334155',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Edit2 size={12} color={theme.primaryBlue} /> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleProductStock(p.id)}
                            style={{
                              padding: '5px 8px',
                              backgroundColor: p.inStock ? '#ECFDF5' : '#FEF2F2',
                              border: p.inStock ? '1px solid #A7F3D0' : '1px solid #FECACA',
                              borderRadius: '6px',
                              color: p.inStock ? '#059669' : '#DC2626',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                            title="Toggle Stock Availability"
                          >
                            {p.inStock ? 'In Stock' : 'Out'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete product "${p.name}"?`)) {
                                deleteProduct(p.id);
                                addToast(`Product "${p.name}" deleted`, 'info');
                              }
                            }}
                            style={{
                              padding: '5px 7px',
                              backgroundColor: '#FEF2F2',
                              border: '1px solid #FCA5A5',
                              borderRadius: '6px',
                              color: '#EF4444',
                              cursor: 'pointer',
                            }}
                            title="Delete SKU"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
                      <Package size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>No products match the selected filters</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>Try resetting your search query or department filters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. BRANDS & ATTRIBUTES
  // -------------------------------------------------------------
  function renderBrandsView() {
    const brandsList = [
      { name: 'UltraTech Cement', logo: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=200', count: 12, category: 'Cement' },
      { name: 'Tata Tiscon', logo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=200', count: 8, category: 'Steel' },
      { name: 'Kajaria Ceramics', logo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200', count: 18, category: 'Tiling' },
      { name: 'Asian Paints', logo: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=200', count: 24, category: 'Paints' },
      { name: 'Dr. Fixit', logo: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=200', count: 9, category: 'Waterproofing' },
      { name: 'Pidilite Fevicol', logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=200', count: 15, category: 'Adhesives' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Partner Brands</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {brandsList.map((b, i) => (
            <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={b.logo} alt={b.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 800, color: theme.textDark, fontSize: '0.9rem' }}>{b.name}</div>
                <div style={{ fontSize: '0.75rem', color: theme.textMuted }}>{b.category} • {b.count} Products</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderAttributesView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Material Attributes & Units</h1>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '1.5rem' }}>
          <p style={{ color: theme.textMuted }}>Configure standardized units: Bag (50kg), Metric Tonne (MT), Sq.Ft, Litre, Box, Bundle, Roll.</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. ORDERS & LIVE LOGISTICS
  // -------------------------------------------------------------
  function renderOrdersView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: theme.textMuted }}>Home › Orders › <span style={{ color: theme.primaryBlue, fontWeight: 600 }}>Orders & Logistics</span></div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Orders & Logistics Tracker</h1>
          <p style={{ color: theme.textMuted, fontSize: '0.85rem' }}>Advance delivery timeline, assign driver & vehicle number in real-time.</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: theme.tableHeaderBg, borderBottom: `1px solid ${theme.sidebarBorder}`, color: '#64748B' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Customer / Site</th>
                <th style={{ padding: '0.75rem 1rem' }}>Items</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Amount</th>
                <th style={{ padding: '0.75rem 1rem' }}>Logistics Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Driver / Vehicle</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: `1px solid ${theme.tableBorder}` }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.primaryBlue }}>
                    {o.orderNumber || o.id}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700 }}>{o.shippingAddress?.fullName || 'Er. Rajesh Malviya'}</div>
                    <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>{o.shippingAddress?.city || 'Indore'}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{o.items?.length || 2} Items</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#10B981' }}>
                    ₹{(o.grandTotal || o.total || 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <select
                      value={o.status || 'Confirmed'}
                      onChange={(e) => {
                        updateOrderStatus(o.id, e.target.value);
                        addToast(`Order ${o.id} status changed to ${e.target.value}`, 'success');
                      }}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.75rem', fontWeight: 700, color: theme.primaryBlue }}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Warehouse Dispatch">Warehouse Dispatch</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered & Unloaded</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem' }}>
                    <div><strong>{o.driverName || 'Ramesh Patel'}</strong></div>
                    <div style={{ color: theme.textMuted }}>{o.vehicleNumber || 'MP-09-TR-4421'}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => navigateTo('order-tracking', { orderId: o.id })}
                      style={{ padding: '4px 10px', backgroundColor: '#EFF6FF', border: 'none', borderRadius: '6px', color: theme.primaryBlue, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Live Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderLiveTrackingView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Live Fleet Logistics Telemetry</h1>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${theme.cardBorder}`, padding: '1.5rem' }}>
          <p style={{ color: theme.textMuted }}>Interactive GPS fleet dispatch map with 60-minute site arrival guarantee simulation.</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 6. USERS
  // -------------------------------------------------------------
  function renderUsersView(title) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>{title} Directory</h1>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: theme.tableHeaderBg, borderBottom: `1px solid ${theme.sidebarBorder}`, color: '#64748B' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Name / Company</th>
                <th style={{ padding: '0.75rem 1rem' }}>Role / Tier</th>
                <th style={{ padding: '0.75rem 1rem' }}>Contact</th>
                <th style={{ padding: '0.75rem 1rem' }}>GSTIN</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${theme.tableBorder}` }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: theme.textDark }}>{u.name}</div>
                    <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>{u.company}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: theme.primaryBlue }}>{u.tier || u.role}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{u.phone}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{u.gstin || 'N/A'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#10B981', fontWeight: 700, fontSize: '0.72rem' }}>Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 7. COUPONS, BANNERS, BOOKINGS, SERVICES, QUOTES, SETTINGS
  // -------------------------------------------------------------
  function renderCouponsView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Coupons & Promo Codes</h1>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: theme.tableHeaderBg, borderBottom: `1px solid ${theme.sidebarBorder}`, color: '#64748B' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Promo Code</th>
                <th style={{ padding: '0.75rem 1rem' }}>Discount %</th>
                <th style={{ padding: '0.75rem 1rem' }}>Min Order</th>
                <th style={{ padding: '0.75rem 1rem' }}>Usage</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.code} style={{ borderBottom: `1px solid ${theme.tableBorder}` }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.primaryBlue }}>{c.code}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#10B981' }}>{c.discountPercentage}% Off</td>
                  <td style={{ padding: '0.75rem 1rem' }}>₹{c.minOrderValue?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{c.usageCount || 0} times</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button
                      onClick={() => toggleCouponStatus(c.code)}
                      style={{ padding: '3px 8px', borderRadius: '10px', backgroundColor: c.isActive ? '#ECFDF5' : '#FEF2F2', color: c.isActive ? '#10B981' : '#EF4444', border: 'none', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderBannersView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Hero Banners & Content</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {banners.map((b) => (
            <div key={b.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
              <img src={b.image} alt={b.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: theme.primaryBlue }}>{b.badge}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: theme.textDark, margin: '4px 0' }}>{b.title}</div>
                <div style={{ fontSize: '0.78rem', color: theme.textMuted }}>{b.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderBookingsView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Technician Bookings Scheduler</h1>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: theme.tableHeaderBg, borderBottom: `1px solid ${theme.sidebarBorder}`, color: '#64748B' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Booking ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                <th style={{ padding: '0.75rem 1rem' }}>Service</th>
                <th style={{ padding: '0.75rem 1rem' }}>Assigned Mistri</th>
                <th style={{ padding: '0.75rem 1rem' }}>Time Slot</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${theme.tableBorder}` }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.primaryBlue }}>{b.id}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{b.customerName}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{b.serviceTitle}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{b.mistriName || 'Unassigned'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{b.date} ({b.timeSlot})</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: theme.primaryBlue, fontWeight: 700, fontSize: '0.72rem' }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderServicesView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Services Catalogue</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {services.map((s) => (
            <div key={s.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem' }}>
              <img src={s.image} alt={s.title} style={{ width: '100%', height: '120px', borderRadius: '10px', objectFit: 'cover', marginBottom: '0.75rem' }} />
              <div style={{ fontWeight: 800, color: theme.textDark, fontSize: '0.9rem' }}>{s.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800, marginTop: '4px' }}>Base Rate: ₹{s.basePrice} ({s.durationHours} hrs)</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderQuotationsView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Project Quotes & BOQs</h1>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: theme.tableHeaderBg, borderBottom: `1px solid ${theme.sidebarBorder}`, color: '#64748B' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Quote ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Builder / Company</th>
                <th style={{ padding: '0.75rem 1rem' }}>Required Materials</th>
                <th style={{ padding: '0.75rem 1rem' }}>Estimated Value</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} style={{ borderBottom: `1px solid ${theme.tableBorder}` }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: theme.primaryBlue }}>{q.id}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700 }}>{q.clientName}</div>
                    <div style={{ fontSize: '0.72rem', color: theme.textMuted }}>{q.company}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', maxWidth: '300px' }}>{q.requiredMaterials}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#10B981' }}>₹{q.estimatedTotal?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', backgroundColor: '#FFF7ED', color: '#FF6B00', fontWeight: 700, fontSize: '0.72rem' }}>
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderFaqsView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Support Tickets & FAQs</h1>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem' }}>
          <p style={{ color: theme.textMuted }}>Review user inquiries and manage help center articles.</p>
        </div>
      </div>
    );
  }

  function renderSettingsView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>General Platform Settings</h1>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: `1px solid ${theme.cardBorder}`, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '640px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Store Name</label>
            <input type="text" value={siteSettings.storeName || ''} onChange={(e) => updateSiteSettings({ storeName: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Support Hotline</label>
            <input type="text" value={siteSettings.supportPhone || ''} onChange={(e) => updateSiteSettings({ supportPhone: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>GST Rate (%)</label>
            <input type="number" value={siteSettings.gstRatePercent || 18} onChange={(e) => updateSiteSettings({ gstRatePercent: Number(e.target.value) })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
          </div>
          <button onClick={() => addToast('Settings updated successfully', 'success')} style={{ padding: '0.6rem 1.25rem', backgroundColor: theme.primaryBlue, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', width: 'fit-content' }}>
            Save Platform Settings
          </button>
        </div>
      </div>
    );
  }

  function renderAdminUsersView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Admin Access Control</h1>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem' }}>
          <p style={{ color: theme.textMuted }}>Manage administrator roles, privileges, and API keys.</p>
        </div>
      </div>
    );
  }

  function renderSystemLogsView() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.textDark }}>Real-time System Audit Logs</h1>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${theme.cardBorder}`, padding: '1.25rem' }}>
          <p style={{ color: theme.textMuted }}>Live audit stream of material price edits, inventory drops, and technician bookings.</p>
        </div>
      </div>
    );
  }
}
