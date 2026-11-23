import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Grid,
  ChefHat,
  Smartphone,
  Package,
  Users,
  Wallet,
  BarChart3,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Bell,
  Search,
  Printer,
  Download,
  Lock,
  AlertTriangle,
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  RotateCcw,
  CheckCircle,
  Loader2,
  Inbox,
  FilterX,
  AlertCircle,
  ShoppingCart,
} from 'lucide-react';
import { loadDemoState } from './lib/demoStorage';
import { usePersistentDemoState } from './hooks/usePersistentDemoState';
import { ROLE_CONFIG, ROLE_IDS, getRoleConfig, resolveTabForRole } from './config/roles';

const INITIAL_MENU = [
  {
    id: 'm1',
    name: 'Classic Smash Burger',
    category: 'Mains',
    price: 950,
    stock: 24,
    prepMins: 12,
    description: 'Seared beef patty, melted cheese, house sauce, and toasted bun.',
    image: '/menu/classic-smash-burger.jfif',
  },
  {
    id: 'm2',
    name: 'Crispy Chicken Tenders',
    category: 'Starters',
    price: 780,
    stock: 18,
    prepMins: 10,
    description: 'Golden crunch chicken strips served with seasoned dip.',
    image: '/menu/crispy-chicken-tenders.jpg',
  },
  {
    id: 'm3',
    name: 'Grilled Peri-Peri Bowl',
    category: 'Mains',
    price: 1120,
    stock: 9,
    prepMins: 15,
    description: 'Flame-grilled chicken over spiced rice, greens, and roasted peppers.',
    image: '/menu/grilled-peri-peri-bowl.jpg',
  },
  {
    id: 'm4',
    name: 'Loaded Truffle Fries',
    category: 'Starters',
    price: 540,
    stock: 4,
    prepMins: 8,
    description: 'Crispy fries tossed with herbs, parmesan, and savory drizzle.',
    image: '/menu/loaded-truffle-fries.jpg',
  },
  {
    id: 'm5',
    name: 'Cold Brew Latte',
    category: 'Drinks',
    price: 490,
    stock: 30,
    prepMins: 4,
    description: 'Slow-steeped cold coffee balanced with chilled milk.',
    image: '/menu/cold-brew-latte.jpg',
  },
  {
    id: 'm6',
    name: 'Warm Chocolate Brownie',
    category: 'Desserts',
    price: 620,
    stock: 12,
    prepMins: 6,
    description: 'Rich baked fudge brownie served warm for dine-in and delivery.',
    image: '/menu/warm-chocolate-brownie.jpg',
  },
];

const INITIAL_TABLES = [
  { id: 'T-01', name: 'Table 01', seats: 2, status: 'available', waiter: 'Ali', total: 0, elapsedMins: 0 },
  { id: 'T-02', name: 'Table 02', seats: 4, status: 'occupied', waiter: 'Sara', total: 2460, elapsedMins: 22 },
  { id: 'T-03', name: 'Table 03', seats: 4, status: 'ready', waiter: 'Ali', total: 1900, elapsedMins: 16 },
  { id: 'T-04', name: 'Table 04', seats: 6, status: 'occupied', waiter: 'Bilal', total: 4120, elapsedMins: 35 },
  { id: 'T-05', name: 'Table 05', seats: 2, status: 'available', waiter: 'Sara', total: 0, elapsedMins: 0 },
  { id: 'T-06', name: 'Table 06', seats: 6, status: 'ready', waiter: 'Bilal', total: 3250, elapsedMins: 19 },
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-104',
    source: 'Dine-In',
    table: 'Table 02',
    waiter: 'Sara',
    items: [
      { name: 'Classic Smash Burger', qty: 2, price: 950, note: 'No onions' },
      { name: 'Cold Brew Latte', qty: 1, price: 490, note: '' },
    ],
    total: 2390,
    paid: false,
    refunded: false,
    kitchenStatus: 'preparing',
    serveStatus: 'waiting',
    elapsedMins: 14,
    synced: true,
  },
  {
    id: 'ORD-105',
    source: 'Dine-In',
    table: 'Table 03',
    waiter: 'Ali',
    items: [
      { name: 'Grilled Peri-Peri Bowl', qty: 1, price: 1120, note: 'Medium spicy' },
      { name: 'Crispy Chicken Tenders', qty: 1, price: 780, note: '' },
    ],
    total: 1900,
    paid: false,
    refunded: false,
    kitchenStatus: 'ready',
    serveStatus: 'waiting',
    elapsedMins: 11,
    synced: true,
  },
  {
    id: 'ORD-106',
    source: 'Takeaway',
    table: 'Counter',
    waiter: 'POS',
    items: [{ name: 'Loaded Truffle Fries', qty: 2, price: 540, note: 'Extra crispy' }],
    total: 1080,
    paid: true,
    refunded: false,
    kitchenStatus: 'new',
    serveStatus: 'waiting',
    elapsedMins: 3,
    synced: true,
  },
];

const INITIAL_INVENTORY = [
  { id: 'INV-1', item: 'Brioche Buns', unit: 'pcs', onHand: 42, minStock: 20 },
  { id: 'INV-2', item: 'Chicken Fillet', unit: 'kg', onHand: 4.5, minStock: 6 },
  { id: 'INV-3', item: 'Coffee Beans', unit: 'kg', onHand: 3.2, minStock: 2 },
  { id: 'INV-4', item: 'Truffle Oil', unit: 'bottles', onHand: 1, minStock: 3 },
];

const INITIAL_RECIPES = [
  { dish: 'Classic Smash Burger', ingredients: '1x Brioche Bun, 140g Beef Patty, Cheese', cost: 385, sell: 950 },
  { dish: 'Grilled Peri-Peri Bowl', ingredients: '180g Chicken Fillet, Rice & Veg, Peri Sauce', cost: 330, sell: 1120 },
  { dish: 'Cold Brew Latte', ingredients: '25g Coffee Beans, 220ml Milk', cost: 140, sell: 490 },
];

const INITIAL_STAFF = [
  { id: 'STF-1', name: 'Ali Raza', role: 'Waiter', shift: '12:00 PM - 8:00 PM', status: 'Checked In' },
  { id: 'STF-2', name: 'Sara Khan', role: 'Waiter', shift: '2:00 PM - 10:00 PM', status: 'Checked In' },
  { id: 'STF-3', name: 'Usman Tariq', role: 'Cashier', shift: '12:00 PM - 8:00 PM', status: 'Checked In' },
  { id: 'STF-4', name: 'Bilal Ahmed', role: 'Kitchen Lead', shift: '11:00 AM - 7:00 PM', status: 'On Break' },
];

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos', label: 'POS Billing', icon: ShoppingBag },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'tables', label: 'Tables', icon: Grid },
  { id: 'kitchen', label: 'Kitchen (KDS)', icon: ChefHat },
  { id: 'waiter', label: 'Waiter Tablet', icon: Smartphone },
  { id: 'inventory', label: 'Inventory & Recipes', icon: Package },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'finance', label: 'Finance & Closing', icon: Wallet },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'website', label: 'Customer Website', icon: Globe },
];

const DEFAULT_PERSISTED_STATE = {
  role: 'admin',
  activeTab: 'dashboard',
  isOnline: true,
  menu: INITIAL_MENU,
  tables: INITIAL_TABLES,
  orders: INITIAL_ORDERS,
  inventory: INITIAL_INVENTORY,
  staff: INITIAL_STAFF,
  reservations: [],
  openingCash: 15000,
  expenses: 2500,
  countedCash: '',
  dayClosed: false,
};

function Badge({ tone = 'neutral', children }) {
  const map = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${
        map[tone] || map.neutral
      }`}
    >
      {children}
    </span>
  );
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}

function InlineSpinner({ label = 'Processing...' }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{label}</span>
    </span>
  );
}

function EmptyState({ title, message, actionLabel, onAction, icon: Icon = Inbox }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
      <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500 mt-1">{message}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function ScreenSkeleton({ tab }) {
  if (tab === 'pos') {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 space-y-4">
          <Skeleton className="h-14 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <Skeleton className="xl:col-span-4 h-[520px] w-full rounded-xl" />
      </div>
    );
  }
  if (tab === 'orders') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-full max-w-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }
  if (tab === 'kitchen') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-96 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  if (tab === 'tables' || tab === 'waiter' || tab === 'staff' || tab === 'reports' || tab === 'website') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}export default function App() {
  const persisted = useMemo(() => loadDemoState(DEFAULT_PERSISTED_STATE), []);
  const initialRole = ROLE_IDS.includes(persisted.role) ? persisted.role : 'admin';
  const initialTab = resolveTabForRole(initialRole, persisted.activeTab);

  const [isHydrating, setIsHydrating] = useState(true);
  const [role, setRole] = useState(initialRole);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isOnline, setIsOnline] = useState(persisted.isOnline !== false);

  const [menu, setMenu] = useState(Array.isArray(persisted.menu) ? persisted.menu : INITIAL_MENU);
  const [tables, setTables] = useState(Array.isArray(persisted.tables) ? persisted.tables : INITIAL_TABLES);
  const [orders, setOrders] = useState(Array.isArray(persisted.orders) ? persisted.orders : INITIAL_ORDERS);
  const [inventory, setInventory] = useState(Array.isArray(persisted.inventory) ? persisted.inventory : INITIAL_INVENTORY);
  const [staff, setStaff] = useState(Array.isArray(persisted.staff) ? persisted.staff : INITIAL_STAFF);
  const [reservations, setReservations] = useState(Array.isArray(persisted.reservations) ? persisted.reservations : []);

  const [openingCash, setOpeningCash] = useState(Number(persisted.openingCash ?? 15000));
  const [expenses, setExpenses] = useState(Number(persisted.expenses ?? 2500));
  const [countedCash, setCountedCash] = useState(persisted.countedCash ?? '');
  const [dayClosed, setDayClosed] = useState(Boolean(persisted.dayClosed));

  const [toast, setToast] = useState(null);
  const [actionState, setActionState] = useState({});

  // POS state
  const [posCategory, setPosCategory] = useState('All');
  const [posSearch, setPosSearch] = useState('');
  const [orderType, setOrderType] = useState('Dine-In');
  const [selectedTable, setSelectedTable] = useState('Table 01');
  const [cart, setCart] = useState([]);
  const [orderNote, setOrderNote] = useState('');
  const [discountPct, setDiscountPct] = useState(0);

  // Orders state
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [inspectOrderId, setInspectOrderId] = useState(null);

  // Inventory
  const [invTab, setInvTab] = useState('stock');
  const [invSearch, setInvSearch] = useState('');

  // Finance
  const [confirmClose, setConfirmClose] = useState(false);

  // Website state
  const [webSection, setWebSection] = useState('home');
  const [webCategory, setWebCategory] = useState('All');
  const [webSearch, setWebSearch] = useState('');
  const [webCart, setWebCart] = useState([]);
  const [webCartOpen, setWebCartOpen] = useState(false);
  const [webFulfillment, setWebFulfillment] = useState('Delivery');
  const [webPayment, setWebPayment] = useState('Cash on Delivery');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [webError, setWebError] = useState('');
  const [webReceipt, setWebReceipt] = useState(null);
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resGuests, setResGuests] = useState(4);
  const [resTime, setResTime] = useState('8:00 PM');
  const [resMsg, setResMsg] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setIsHydrating(false), 450);
    return () => clearTimeout(t);
  }, []);

  const persistedSlice = useMemo(
    () => ({
      role,
      activeTab,
      isOnline,
      menu,
      tables,
      orders,
      inventory,
      staff,
      reservations,
      openingCash,
      expenses,
      countedCash,
      dayClosed,
    }),
    [role, activeTab, isOnline, menu, tables, orders, inventory, staff, reservations, openingCash, expenses, countedCash, dayClosed]
  );

  usePersistentDemoState(persistedSlice, { enabled: !isHydrating });

  useEffect(() => {
    const resolved = resolveTabForRole(role, activeTab);
    if (resolved !== activeTab) setActiveTab(resolved);
  }, [role, activeTab]);

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone, id: Date.now() });
    window.setTimeout(() => setToast((t) => (t && t.message === message ? null : t)), 2800);
  };

  const setActionLoading = (key, value) => {
    setActionState((prev) => ({ ...prev, [key]: value }));
  };

  const pendingSync = useMemo(() => orders.filter((o) => !o.synced).length, [orders]);
  const readyForWaiter = useMemo(
    () => orders.filter((o) => o.kitchenStatus === 'ready' && o.serveStatus !== 'served'),
    [orders]
  );
  const servedToday = useMemo(
    () => orders.filter((o) => o.serveStatus === 'served').length,
    [orders]
  );
  const grossSales = useMemo(
    () => orders.filter((o) => !o.refunded).reduce((s, o) => s + o.total, 0),
    [orders]
  );
  const unpaidTotal = useMemo(
    () => orders.filter((o) => !o.paid && !o.refunded).reduce((s, o) => s + o.total, 0),
    [orders]
  );
  const collectedSales = useMemo(
    () => orders.filter((o) => o.paid && !o.refunded).reduce((s, o) => s + o.total, 0),
    [orders]
  );
  const occupiedTables = useMemo(
    () => tables.filter((t) => t.status !== 'available').length,
    [tables]
  );
  const lowStockCount = useMemo(
    () => inventory.filter((i) => i.onHand <= i.minStock).length,
    [inventory]
  );

  const roleConfig = getRoleConfig(role);
  const visibleNav = NAV.filter((item) => roleConfig.tabs.includes(item.id));

  const switchRole = (nextRole) => {
    if (nextRole === role) return;
    const nextTab = resolveTabForRole(nextRole, activeTab);
    setRole(nextRole);
    setActiveTab(nextTab);
    showToast(`Switched to ${getRoleConfig(nextRole).label} view`);
  };

  const toggleOnline = async () => {
    const next = !isOnline;
    setActionLoading('sync', true);
    await delay(350);
    setIsOnline(next);
    if (next) {
      setOrders((prev) => prev.map((o) => ({ ...o, synced: true })));
      showToast('Back online. Pending orders synced successfully.', 'success');
    } else {
      showToast('Offline mode enabled. New actions will be queued locally.', 'warning');
    }
    setActionLoading('sync', false);
  };

  const syncNow = async () => {
    if (!isOnline) {
      showToast('You are offline. Switch to Online before syncing.', 'warning');
      return;
    }
    if (pendingSync === 0) {
      showToast('All data is already synced.', 'success');
      return;
    }
    setActionLoading('sync', true);
    await delay(600);
    setOrders((prev) => prev.map((o) => ({ ...o, synced: true })));
    setActionLoading('sync', false);
    showToast('Pending orders synced successfully.', 'success');
  };

  const addPosItem = (item) => {
    if (item.stock <= 0) return;
    setCart((prev) => {
      const hit = prev.find((c) => c.id === item.id);
      if (hit) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const stepPosQty = (id, delta) => {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0)
    );
  };

  const posSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const posDiscount = Math.round((posSubtotal * discountPct) / 100);
  const posTax = Math.round((posSubtotal - posDiscount) * 0.05);
  const posTotal = posSubtotal - posDiscount + posTax;

  const submitPosOrder = async (paidNow) => {
    if (cart.length === 0 || actionState.posCheckout) return;
    setActionLoading('posCheckout', true);
    await delay(550);
    const id = `ORD-${107 + orders.length}`;
    const target = orderType === 'Dine-In' ? selectedTable : orderType;
    const created = {
      id,
      source: orderType,
      table: target,
      waiter: 'Ali',
      items: cart.map((c) => ({ name: c.name, qty: c.qty, price: c.price, note: orderNote })),
      total: posTotal,
      paid: paidNow,
      refunded: false,
      kitchenStatus: 'new',
      serveStatus: 'waiting',
      elapsedMins: 0,
      synced: isOnline,
    };
    setOrders((prev) => [created, ...prev]);
    if (orderType === 'Dine-In') {
      setTables((prev) =>
        prev.map((t) =>
          t.name === selectedTable
            ? { ...t, status: 'occupied', total: t.total + posTotal, elapsedMins: Math.max(1, t.elapsedMins || 0) }
            : t
        )
      );
    }
    setCart([]);
    setOrderNote('');
    setDiscountPct(0);
    setActionLoading('posCheckout', false);
    showToast(`${id} ${paidNow ? 'paid and' : ''} sent to Kitchen${!isOnline ? ' (saved offline)' : ''}.`);
  };

  const advanceKitchen = async (orderId) => {
    if (actionState[`kitchen-${orderId}`]) return;
    setActionLoading(`kitchen-${orderId}`, true);
    await delay(300);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const next = o.kitchenStatus === 'new' ? 'preparing' : o.kitchenStatus === 'preparing' ? 'ready' : 'ready';
        return { ...o, kitchenStatus: next };
      })
    );
    const order = orders.find((o) => o.id === orderId);
    if (order && order.kitchenStatus === 'preparing' && order.source === 'Dine-In') {
      setTables((ts) => ts.map((t) => (t.name === order.table ? { ...t, status: 'ready' } : t)));
    }
    setActionLoading(`kitchen-${orderId}`, false);
    showToast(`Kitchen status updated for ${orderId}.`);
  };

  const updateServe = async (orderId, serveStatus) => {
    if (actionState[`serve-${orderId}`]) return;
    setActionLoading(`serve-${orderId}`, true);
    await delay(300);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, serveStatus } : o)));
    const target = orders.find((o) => o.id === orderId);
    if (serveStatus === 'served' && target?.source === 'Dine-In') {
      setTables((prev) => prev.map((t) => (t.name === target.table ? { ...t, status: 'occupied' } : t)));
    }
    setActionLoading(`serve-${orderId}`, false);
    showToast(`${orderId} marked as ${serveStatus.replace('_', ' ')}.`);
  };

  const addWebItem = (dish) => {
    if (dish.stock <= 0) return;
    setWebReceipt(null);
    setWebCart((prev) => {
      const hit = prev.find((c) => c.id === dish.id);
      if (hit) return prev.map((c) => (c.id === dish.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...dish, qty: 1 }];
    });
  };

  const stepWebQty = (id, delta) => {
    setWebCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0)
    );
  };

  const webSub = webCart.reduce((s, i) => s + i.price * i.qty, 0);
  const webDeliv = webFulfillment === 'Delivery' && webSub > 0 ? 200 : 0;
  const webTax = Math.round(webSub * 0.05);
  const webGrand = webSub + webDeliv + webTax;
  const webCartQty = webCart.reduce((s, i) => s + i.qty, 0);
  const webCartTotal = webSub;

  const checkoutWebsite = async (e) => {
    e.preventDefault();
    setWebError('');
    if (actionState.webCheckout) return;
    if (webCart.length === 0) {
      setWebError('Add at least one item to order.');
      return;
    }
    if (!custName.trim() || !custPhone.trim()) {
      setWebError('Please enter your name and phone number.');
      return;
    }
    if (webFulfillment === 'Delivery' && !custAddress.trim()) {
      setWebError('Please enter a delivery address.');
      return;
    }
    setActionLoading('webCheckout', true);
    await delay(650);
    const id = `WEB-${301 + orders.length}`;
    const newOrder = {
      id,
      source: 'Website',
      table: webFulfillment === 'Delivery' ? 'Web Delivery' : 'Web Pickup',
      waiter: 'Online',
      customerName: custName.trim(),
      customerPhone: custPhone.trim(),
      deliveryAddress: webFulfillment === 'Delivery' ? custAddress.trim() : 'Pickup Counter',
      items: webCart.map((i) => ({ name: i.name, qty: i.qty, price: i.price, note: '' })),
      total: webGrand,
      paid: webPayment === 'Card / Online',
      refunded: false,
      kitchenStatus: 'new',
      serveStatus: 'waiting',
      elapsedMins: 0,
      synced: isOnline,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setMenu((prev) =>
      prev.map((m) => {
        const ordered = webCart.find((c) => c.id === m.id);
        return ordered ? { ...m, stock: Math.max(0, m.stock - ordered.qty) } : m;
      })
    );
    setWebReceipt(newOrder);
    setWebCart([]);
    setCustName('');
    setCustPhone('');
    setCustAddress('');
    setWebCartOpen(false);
    setActionLoading('webCheckout', false);
    showToast(`Website order ${id} placed and sent to POS & Kitchen.`);
  };

  const submitReservation = async (e) => {
    e.preventDefault();
    if (actionState.reservation) return;
    if (!resName.trim() || !resPhone.trim()) return;
    setActionLoading('reservation', true);
    await delay(450);
    setReservations((prev) => [
      { id: `RSV-${201 + prev.length}`, name: resName.trim(), phone: resPhone.trim(), guests: Number(resGuests), time: resTime },
      ...prev,
    ]);
    setResMsg(`Table request confirmed for ${resName.trim()} (${resGuests} guests at ${resTime}).`);
    setResName('');
    setResPhone('');
    setActionLoading('reservation', false);
    showToast('Reservation saved successfully.');
  };

  const markOrderPaid = async (orderId) => {
    if (actionState[`pay-${orderId}`]) return;
    setActionLoading(`pay-${orderId}`, true);
    await delay(450);
    setOrders((prev) => prev.map((x) => (x.id === orderId ? { ...x, paid: true, refunded: false } : x)));
    setActionLoading(`pay-${orderId}`, false);
    showToast(`${orderId} marked as paid.`);
  };

  const refundOrder = async (orderId) => {
    if (actionState[`refund-${orderId}`]) return;
    setActionLoading(`refund-${orderId}`, true);
    await delay(550);
    setOrders((prev) => prev.map((x) => (x.id === orderId ? { ...x, paid: false, refunded: true, synced: isOnline } : x)));
    setActionLoading(`refund-${orderId}`, false);
    showToast(`${orderId} refunded successfully.`);
  };

  const saveDayClosing = async () => {
    if (actionState.dayClose) return;
    setActionLoading('dayClose', true);
    await delay(600);
    setDayClosed(true);
    setConfirmClose(false);
    setActionLoading('dayClose', false);
    showToast('Day closing saved and locked.');
  };

  const exportCsv = async () => {
    if (actionState.exportCsv) return;
    setActionLoading('exportCsv', true);
    await delay(350);
    const csv = [
      ['ID', 'Source', 'Table', 'Kitchen', 'Paid', 'Refunded', 'Synced', 'Total'],
      ...orders.map((o) => [o.id, o.source, o.table, o.kitchenStatus, o.paid, o.refunded || false, o.synced, o.total]),
    ]
      .map((r) => r.join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-report.csv';
    a.click();
    URL.revokeObjectURL(url);
    setActionLoading('exportCsv', false);
    showToast('CSV report exported.');
  };

  const filteredPosMenu = menu.filter((m) => {
    const catOk = posCategory === 'All' || m.category === posCategory;
    const qOk = m.name.toLowerCase().includes(posSearch.toLowerCase());
    return catOk && qOk;
  });

  const filteredOrders = orders.filter((o) => {
    const qOk =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.table.toLowerCase().includes(orderSearch.toLowerCase());
    if (!qOk) return false;
    if (orderFilter === 'all') return true;
    if (orderFilter === 'unpaid') return !o.paid && !o.refunded;
    if (orderFilter === 'served') return o.serveStatus === 'served';
    return o.kitchenStatus === orderFilter;
  });

  const inspectedOrder = orders.find((o) => o.id === inspectOrderId) || null;
  const expectedCash = Number(openingCash) + collectedSales - Number(expenses);
  const cashDiff = countedCash === '' ? null : Number(countedCash) - expectedCash;

  const filteredWebMenu = menu.filter((m) => {
    const catOk = webCategory === 'All' || m.category === webCategory;
    const qOk = m.name.toLowerCase().includes(webSearch.toLowerCase());
    return catOk && qOk;
  });

  const resetPosFilters = () => {
    setPosCategory('All');
    setPosSearch('');
  };
  const resetOrderFilters = () => {
    setOrderFilter('all');
    setOrderSearch('');
  };
  const resetInvSearch = () => setInvSearch('');
  const resetWebFilters = () => {
    setWebCategory('All');
    setWebSearch('');
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {(!isOnline || pendingSync > 0) && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-amber-950">
          <div className="flex items-center gap-2 font-medium">
            {isOnline ? <RefreshCw className="w-4 h-4 text-amber-700 shrink-0" /> : <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />}
            <span>
              {isOnline
                ? `${pendingSync} pending action${pendingSync === 1 ? '' : 's'} queued for sync.`
                : `Offline mode: ${pendingSync} pending action${pendingSync === 1 ? '' : 's'} saved locally and will sync when online.`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white border border-amber-300 text-[11px] font-semibold">
              Queue: {pendingSync}
            </span>
            <button
              type="button"
              onClick={syncNow}
              disabled={!!actionState.sync || !isOnline || pendingSync === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-amber-300 text-amber-900 font-semibold hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {actionState.sync ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{actionState.sync ? 'Syncing...' : 'Retry Sync'}</span>
            </button>
          </div>
        </div>
      )}

      <header className="h-auto sm:h-16 bg-slate-900 text-white px-4 py-2 sm:py-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shrink-0">
            RF
          </div>
          <div className="truncate">
            <span className="font-semibold text-sm sm:text-base">RestroFlow</span>
            <span className="hidden md:inline text-xs text-slate-400 ml-2">
              {roleConfig.label} Ã¢â‚¬Â¢ {roleConfig.description}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex items-center rounded-lg bg-slate-800 border border-slate-700 p-0.5">
            {ROLE_IDS.map((id) => {
              const cfg = ROLE_CONFIG[id];
              const active = role === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchRole(id)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition ${
                    active ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                  title={`${cfg.label}: ${cfg.description}`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {roleConfig.tabs.includes('website') && (
            <button
              type="button"
              onClick={() => setActiveTab('website')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium border border-slate-700"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Website</span>
            </button>
          )}

          {roleConfig.tabs.includes('waiter') && (
            <button
              type="button"
              onClick={() => setActiveTab('waiter')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium border border-slate-700"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Ready</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[11px] leading-none">
                {readyForWaiter.length}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleOnline}
            disabled={!!actionState.sync}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border disabled:opacity-60 ${
              isOnline
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700'
                : 'bg-amber-950/70 text-amber-300 border-amber-700'
            }`}
          >
            {actionState.sync ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <aside className="w-16 lg:w-56 bg-white border-r border-slate-200 shrink-0 py-3 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="px-3 pt-4 hidden lg:block">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Demo Persistence</p>
              <p>Orders, tables, role, and sync queue are saved locally.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {isHydrating ? (
            <ScreenSkeleton tab={activeTab} />
          ) : (
            <>              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
                    <p className="text-sm text-slate-500">Live restaurant snapshot for the {roleConfig.label} role.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                    <button type="button" onClick={() => roleConfig.tabs.includes('reports') && setActiveTab('reports')} className="text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-400">
                      <p className="text-xs font-medium text-slate-500">Gross Sales</p>
                      <p className="text-2xl font-bold mt-1">PKR {grossSales.toLocaleString()}</p>
                      <p className="text-xs text-emerald-700 mt-2">Collected: PKR {collectedSales.toLocaleString()}</p>
                    </button>
                    <button type="button" onClick={() => roleConfig.tabs.includes('orders') && setActiveTab('orders')} className="text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-400">
                      <p className="text-xs font-medium text-slate-500">Total Orders</p>
                      <p className="text-2xl font-bold mt-1">{orders.length}</p>
                      <p className="text-xs text-slate-600 mt-2">View orders</p>
                    </button>
                    <button type="button" onClick={() => roleConfig.tabs.includes('kitchen') && setActiveTab('kitchen')} className="text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-400">
                      <p className="text-xs font-medium text-slate-500">Ready to Serve</p>
                      <p className="text-2xl font-bold mt-1">{readyForWaiter.length}</p>
                      <p className="text-xs text-blue-700 mt-2">Kitchen & waiter queue</p>
                    </button>
                    <button type="button" onClick={() => roleConfig.tabs.includes('tables') && setActiveTab('tables')} className="text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-400">
                      <p className="text-xs font-medium text-slate-500">Occupied Tables</p>
                      <p className="text-2xl font-bold mt-1">{occupiedTables} / {tables.length}</p>
                      <p className="text-xs text-slate-600 mt-2">Floor status</p>
                    </button>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <p className="text-xs font-medium text-slate-500">Sync Queue / Low Stock</p>
                      <p className="text-2xl font-bold mt-1">{pendingSync} pending</p>
                      <p className="text-xs text-rose-700 mt-2">Low stock: {lowStockCount} Ã¢â‚¬Â¢ Unpaid: PKR {unpaidTotal.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h2 className="text-sm font-semibold text-slate-900 mb-3">Recent Activity</h2>
                    {orders.length === 0 ? (
                      <EmptyState title="No activity yet" message="Orders will appear here as they are created from POS or the website." icon={Inbox} />
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {orders.slice(0, 6).map((o) => (
                          <div key={o.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                            <div>
                              <span className="font-semibold">{o.id}</span>
                              <span className="text-slate-500 ml-2">{o.table} ({o.source})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {o.refunded ? <Badge tone="danger">Refunded</Badge> : <Badge tone={o.kitchenStatus === 'ready' ? 'info' : 'warning'}>{o.kitchenStatus}</Badge>}
                              <span className="font-semibold">PKR {o.total.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'pos' && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                  <div className="xl:col-span-8 space-y-4">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {['All', 'Starters', 'Mains', 'Drinks', 'Desserts'].map((c) => (
                          <button key={c} type="button" onClick={() => setPosCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${posCategory === c ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {c}
                          </button>
                        ))}
                      </div>
                      <div className="relative w-full sm:w-56">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input type="text" value={posSearch} onChange={(e) => setPosSearch(e.target.value)} placeholder="Search items..." className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
                      </div>
                    </div>

                    {filteredPosMenu.length === 0 ? (
                      <EmptyState
                        title="No menu items found"
                        message="Try a different search term or category to continue building an order."
                        actionLabel={posSearch || posCategory !== 'All' ? 'Reset Filters' : undefined}
                        onAction={posSearch || posCategory !== 'All' ? resetPosFilters : undefined}
                        icon={FilterX}
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredPosMenu.map((item) => (
                          <button key={item.id} type="button" onClick={() => addPosItem(item)} disabled={item.stock <= 0} className="text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-900 flex flex-col justify-between min-h-[116px] disabled:opacity-50">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-semibold text-sm text-slate-900">{item.name}</span>
                                <span className="text-xs text-slate-400">{item.category}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">Stock: {item.stock} Ã¢â‚¬Â¢ ~{item.prepMins}m</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="font-bold text-sm">PKR {item.price.toLocaleString()}</span>
                              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 px-2 py-1 rounded"><Plus className="w-3.5 h-3.5" /> Add</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200 p-4 space-y-4 sticky top-20">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h2 className="font-semibold text-base">Order Ticket</h2>
                      <span className="text-xs text-slate-500">{cart.length} item(s)</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg">
                      {['Dine-In', 'Takeaway', 'Delivery'].map((t) => (
                        <button key={t} type="button" onClick={() => setOrderType(t)} className={`py-1.5 text-xs font-semibold rounded-md ${orderType === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}>{t}</button>
                      ))}
                    </div>

                    {orderType === 'Dine-In' && (
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Table</label>
                        <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
                          {tables.map((t) => (
                            <option key={t.id} value={t.name}>{t.name} ({t.seats} seats ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ {t.status})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {cart.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">Tap menu items to build an order.</p>
                      ) : (
                        cart.map((c) => (
                          <div key={c.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{c.name}</p>
                              <p className="text-xs text-slate-500">PKR {(c.price * c.qty).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button type="button" onClick={() => stepPosQty(c.id, -1)} className="w-7 h-7 rounded bg-white border border-slate-300 flex items-center justify-center">
                                {c.qty === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-600" /> : <Minus className="w-3.5 h-3.5" />}
                              </button>
                              <span className="w-5 text-center text-sm font-semibold">{c.qty}</span>
                              <button type="button" onClick={() => stepPosQty(c.id, 1)} className="w-7 h-7 rounded bg-white border border-slate-300 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Kitchen Note</label>
                      <input type="text" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder="e.g. No onions, extra sauce..." className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg" />
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-1.5 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Discount (%)</span>
                        <input type="number" min="0" max="50" value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value) || 0)} className="w-20 px-2 py-1 text-right border border-slate-300 rounded text-sm" />
                      </div>
                      <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>PKR {posSubtotal.toLocaleString()}</span></div>
                      <div className="flex justify-between text-slate-600"><span>Tax (5%)</span><span>PKR {posTax.toLocaleString()}</span></div>
                      <div className="flex justify-between font-bold text-base pt-1 border-t border-slate-100"><span>Total</span><span>PKR {posTotal.toLocaleString()}</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" disabled={cart.length === 0 || !!actionState.posCheckout} onClick={() => submitPosOrder(false)} className="py-2.5 px-3 rounded-lg border border-slate-900 text-slate-900 font-semibold text-xs sm:text-sm hover:bg-slate-50 disabled:opacity-40 inline-flex items-center justify-center gap-2">
                        {actionState.posCheckout ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        <span>{actionState.posCheckout ? 'Sending...' : 'Send to Kitchen'}</span>
                      </button>
                      <button type="button" disabled={cart.length === 0 || !!actionState.posCheckout} onClick={() => submitPosOrder(true)} className="py-2.5 px-3 rounded-lg bg-slate-900 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-40 inline-flex items-center justify-center gap-2">
                        {actionState.posCheckout ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        <span>{actionState.posCheckout ? 'Processing...' : 'Pay & Send'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold">Orders</h1>
                    <input type="text" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search order ID or table..." className="w-full md:w-64 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg" />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[['all', 'All'], ['new', 'New'], ['preparing', 'Preparing'], ['ready', 'Ready'], ['served', 'Served'], ['unpaid', 'Pending Payment']].map(([key, label]) => (
                      <button key={key} type="button" onClick={() => setOrderFilter(key)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${orderFilter === key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}>{label}</button>
                    ))}
                  </div>

                  {filteredOrders.length === 0 ? (
                    <EmptyState
                      title="No orders match your view"
                      message={orderSearch || orderFilter !== 'all' ? 'Adjust or clear your search and filters to see orders.' : 'New orders from POS and the website will appear here.'}
                      actionLabel={orderSearch || orderFilter !== 'all' ? 'Reset Filters' : undefined}
                      onAction={orderSearch || orderFilter !== 'all' ? resetOrderFilters : undefined}
                      icon={FilterX}
                    />
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Source / Table</th>
                            <th className="px-4 py-3">Kitchen</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Sync</th>
                            <th className="px-4 py-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredOrders.map((o) => (
                            <tr key={o.id} onClick={() => setInspectOrderId(o.id)} className="hover:bg-slate-50 cursor-pointer">
                              <td className="px-4 py-3 font-semibold">{o.id}</td>
                              <td className="px-4 py-3">{o.table} <span className="text-xs text-slate-500">({o.source})</span></td>
                              <td className="px-4 py-3"><Badge tone={o.kitchenStatus === 'ready' ? 'info' : 'warning'}>{o.kitchenStatus}</Badge></td>
                              <td className="px-4 py-3">
                                {o.refunded ? <Badge tone="danger">Refunded</Badge> : <Badge tone={o.paid ? 'success' : 'danger'}>{o.paid ? 'Paid' : 'Unpaid'}</Badge>}
                              </td>
                              <td className="px-4 py-3 text-xs">
                                <span className={o.synced ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>{o.synced ? 'Synced' : 'Pending'}</span>
                              </td>
                              <td className="px-4 py-3 text-right font-semibold">PKR {o.total.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {inspectedOrder && (
                    <div className="fixed inset-0 z-40 bg-slate-950/40 flex justify-end">
                      <div className="w-full max-w-md bg-white h-full p-5 shadow-xl flex flex-col justify-between overflow-y-auto">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <div>
                              <h3 className="font-bold text-base">{inspectedOrder.id} Ã¢â‚¬Â¢ {inspectedOrder.table}</h3>
                              <p className="text-xs text-slate-500">{inspectedOrder.source} Ã¢â‚¬Â¢ Kitchen: {inspectedOrder.kitchenStatus} Ã¢â‚¬Â¢ {inspectedOrder.synced ? 'Synced' : 'Pending sync'}</p>
                            </div>
                            <button type="button" onClick={() => setInspectOrderId(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
                          </div>
                          <div className="space-y-2 text-sm">
                            {inspectedOrder.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between py-1 border-b border-slate-50">
                                <div>
                                  <p className="font-medium">{it.qty}x {it.name}</p>
                                  {it.note && <p className="text-xs text-amber-800">Note: {it.note}</p>}
                                </div>
                                <span className="font-semibold">PKR {(it.qty * it.price).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span>PKR {inspectedOrder.total.toLocaleString()}</span></div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                          {!inspectedOrder.paid && !inspectedOrder.refunded && (
                            <button type="button" disabled={!!actionState[`pay-${inspectedOrder.id}`]} onClick={() => markOrderPaid(inspectedOrder.id)} className="flex-1 py-2.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50">
                              {actionState[`pay-${inspectedOrder.id}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                              <span>{actionState[`pay-${inspectedOrder.id}`] ? 'Saving...' : 'Mark Paid'}</span>
                            </button>
                          )}
                          {inspectedOrder.paid && !inspectedOrder.refunded && (
                            <button type="button" disabled={!!actionState[`refund-${inspectedOrder.id}`]} onClick={() => refundOrder(inspectedOrder.id)} className="flex-1 py-2.5 rounded-lg bg-rose-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50">
                              {actionState[`refund-${inspectedOrder.id}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                              <span>{actionState[`refund-${inspectedOrder.id}`] ? 'Refunding...' : 'Refund'}</span>
                            </button>
                          )}
                          <button type="button" onClick={() => { window.print(); showToast(`Print dialog opened for ${inspectedOrder.id}.`); }} className="flex-1 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold inline-flex items-center justify-center gap-1.5">
                            <Printer className="w-4 h-4" /> Print Slip
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}              {activeTab === 'tables' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-semibold">Tables Floor Plan</h1>
                      <p className="text-sm text-slate-500">Visual seating status, active totals, and quick actions.</p>
                    </div>
                    {roleConfig.tabs.includes('pos') && (
                      <button type="button" onClick={() => setActiveTab('pos')} className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold">New Order</button>
                    )}
                  </div>
                  {tables.length === 0 ? (
                    <EmptyState title="No tables configured" message="Add tables to manage floor operations." />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tables.map((t) => {
                        const tone = t.status === 'available' ? 'success' : t.status === 'ready' ? 'info' : t.status === 'reserved' ? 'warning' : 'warning';
                        const label = t.status === 'available' ? 'Available' : t.status === 'ready' ? 'Ready to Serve' : t.status === 'reserved' ? 'Reserved' : 'Occupied';
                        return (
                          <div key={t.id} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h2 className="font-bold text-base">{t.name}</h2>
                                <p className="text-xs text-slate-500 mt-0.5">{t.seats} Seats ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ Waiter: {t.waiter}</p>
                                {t.reservedFor && <p className="text-xs text-amber-700 mt-1">Reserved: {t.reservedFor}</p>}
                              </div>
                              <Badge tone={tone}>{label}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                              <span className="text-slate-500">{t.status === 'available' ? 'Open table' : `Duration: ${t.elapsedMins || 0}m`}</span>
                              <span className="font-bold">{t.total > 0 ? `PKR ${t.total.toLocaleString()}` : 'Ã¢â‚¬â€'}</span>
                            </div>
                            <div className="flex gap-2">
                              {roleConfig.tabs.includes('pos') && (
                                <button type="button" onClick={() => { setSelectedTable(t.name); setOrderType('Dine-In'); setActiveTab('pos'); }} className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold">Open POS</button>
                              )}
                              {t.status !== 'available' && (
                                <button type="button" onClick={() => { setTables((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: 'available', total: 0, elapsedMins: 0, reservedFor: '' } : x))); showToast(`${t.name} set to available.`); }} className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50">Clear</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'kitchen' && (
                <div className="space-y-4">
                  <div>
                    <h1 className="text-xl font-semibold">Kitchen Display</h1>
                    <p className="text-sm text-slate-500">Preparation queue with status updates and sync-aware tickets.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {[['new', 'New', 'Start Preparing'], ['preparing', 'Preparing', 'Mark Ready'], ['ready', 'Ready', null]].map(([col, title, action]) => {
                      const list = orders.filter((o) => o.kitchenStatus === col && !o.refunded);
                      return (
                        <div key={col} className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h2 className="font-semibold text-sm">{title}</h2>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100">{list.length}</span>
                          </div>
                          {list.length === 0 ? (
                            <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">No {title.toLowerCase()} tickets right now.</div>
                          ) : (
                            list.map((o) => (
                              <div key={o.id} className={`p-3.5 rounded-lg border space-y-2.5 ${o.elapsedMins >= 15 && col !== 'ready' ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-slate-50/50'}`}>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-sm">{o.table} Ã¢â‚¬Â¢ {o.id}</span>
                                  <div className="flex items-center gap-2">
                                    {!o.synced && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Pending sync</span>}
                                    <span className="text-xs font-semibold text-slate-600">{o.elapsedMins || 0}m</span>
                                  </div>
                                </div>
                                <ul className="space-y-1 text-sm">
                                  {o.items.map((it, i) => (
                                    <li key={i}><span className="font-bold">{it.qty}x</span> {it.name}{it.note && <span className="block text-xs font-semibold text-rose-700">Note: {it.note}</span>}</li>
                                  ))}
                                </ul>
                                {action && (
                                  <button type="button" disabled={!!actionState[`kitchen-${o.id}`]} onClick={() => advanceKitchen(o.id)} className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 inline-flex items-center justify-center gap-2">
                                    {actionState[`kitchen-${o.id}`] && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span>{actionState[`kitchen-${o.id}`] ? 'Updating...' : action}</span>
                                  </button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'waiter' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h1 className="text-xl font-semibold">Waiter Tablet</h1>
                      <p className="text-sm text-slate-500">Ready orders, pickup, and serving actions.</p>
                    </div>
                    <div className="flex gap-2"><Badge tone="info">Ready: {readyForWaiter.length}</Badge><Badge tone="success">Served Today: {servedToday}</Badge></div>
                  </div>
                  {readyForWaiter.length === 0 ? (
                    <EmptyState title="No orders waiting to serve" message="When the kitchen marks an order ready, it will appear here for pickup and serving." icon={CheckCircle2} />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {readyForWaiter.map((o) => (
                        <div key={o.id} className="bg-white p-4 rounded-xl border-2 border-blue-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <div><span className="font-bold text-base">{o.table}</span><span className="text-xs text-slate-500 ml-2">{o.id} Ã¢â‚¬Â¢ {o.waiter}</span></div>
                            <Badge tone="info">{o.serveStatus === 'picked_up' ? 'Delivering' : 'Ready to Serve'}</Badge>
                          </div>
                          <div className="text-sm space-y-1">{o.items.map((it, idx) => (<div key={idx}><strong>{it.qty}x</strong> {it.name}</div>))}</div>
                          <div className="flex gap-2 pt-1">
                            {o.serveStatus !== 'picked_up' && (
                              <button type="button" disabled={!!actionState[`serve-${o.id}`]} onClick={() => updateServe(o.id, 'picked_up')} className="flex-1 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 inline-flex items-center justify-center gap-2">
                                {actionState[`serve-${o.id}`] && <Loader2 className="w-4 h-4 animate-spin" />}Picked Up
                              </button>
                            )}
                            <button type="button" disabled={!!actionState[`serve-${o.id}`]} onClick={() => updateServe(o.id, 'served')} className="flex-1 py-2.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50 inline-flex items-center justify-center gap-1.5">
                              {actionState[`serve-${o.id}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}<span>{actionState[`serve-${o.id}`] ? 'Updating...' : 'Mark Served'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold">Inventory &amp; Recipes</h1>
                    <div className="flex gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                      <button type="button" onClick={() => setInvTab('stock')} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${invTab === 'stock' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Stock</button>
                      <button type="button" onClick={() => setInvTab('recipes')} className={`px-3 py-1.5 rounded-md text-xs font-semibold ${invTab === 'recipes' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Recipes &amp; Cost</button>
                    </div>
                  </div>
                  {invTab === 'stock' ? (
                    <div className="space-y-3">
                      <input type="text" value={invSearch} onChange={(e) => setInvSearch(e.target.value)} placeholder="Search stock item..." className="w-full sm:w-64 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg" />
                      {inventory.filter((r) => r.item.toLowerCase().includes(invSearch.toLowerCase())).length === 0 ? (
                        <EmptyState title="No stock items found" message="Clear your search to view all inventory items." actionLabel={invSearch ? 'Clear Search' : undefined} onAction={invSearch ? resetInvSearch : undefined} icon={FilterX} />
                      ) : (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">On Hand</th><th className="px-4 py-3">Min Stock</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Adjust</th></tr></thead>
                            <tbody className="divide-y divide-slate-100">
                              {inventory.filter((r) => r.item.toLowerCase().includes(invSearch.toLowerCase())).map((r) => {
                                const low = r.onHand <= r.minStock;
                                return (
                                  <tr key={r.id}>
                                    <td className="px-4 py-3 font-medium">{r.item}</td>
                                    <td className="px-4 py-3 font-semibold">{r.onHand} {r.unit}</td>
                                    <td className="px-4 py-3 text-slate-500">{r.minStock} {r.unit}</td>
                                    <td className="px-4 py-3"><Badge tone={low ? 'danger' : 'success'}>{low ? 'Low Stock' : 'In Stock'}</Badge></td>
                                    <td className="px-4 py-3 text-right"><button type="button" onClick={() => { setInventory((prev) => prev.map((x) => (x.id === r.id ? { ...x, onHand: x.onHand + 5 } : x))); showToast(`${r.item} stock updated.`); }} className="px-2.5 py-1 rounded border border-slate-300 text-xs font-semibold hover:bg-slate-50">+5 {r.unit}</button></td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Dish</th><th className="px-4 py-3">Ingredients</th><th className="px-4 py-3">Recipe Cost</th><th className="px-4 py-3">Sell Price</th><th className="px-4 py-3 text-right">Food Cost %</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {INITIAL_RECIPES.map((rec) => (
                            <tr key={rec.dish}><td className="px-4 py-3 font-semibold">{rec.dish}</td><td className="px-4 py-3 text-xs text-slate-600">{rec.ingredients}</td><td className="px-4 py-3">PKR {rec.cost}</td><td className="px-4 py-3 font-semibold">PKR {rec.sell}</td><td className="px-4 py-3 text-right font-bold">{((rec.cost / rec.sell) * 100).toFixed(1)}%</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'staff' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h1 className="text-xl font-semibold">Staff &amp; Attendance</h1>
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200"><Lock className="w-3.5 h-3.5" /> Payroll restricted to Owner</span>
                  </div>
                  {staff.length === 0 ? (
                    <EmptyState title="No staff records" message="Staff members will appear here once added." />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {staff.map((m) => (
                        <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                          <div><p className="font-semibold text-sm">{m.name}</p><p className="text-xs text-slate-500">{m.role} Ã¢â‚¬Â¢ {m.shift}</p></div>
                          <button type="button" onClick={() => { setStaff((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: x.status === 'Checked In' ? 'Checked Out' : 'Checked In' } : x))); showToast(`${m.name} status updated.`); }} className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50">{m.status}</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'finance' && (
                <div className="max-w-xl bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Finance &amp; Day Closing</h1>
                    <Badge tone={dayClosed ? 'success' : 'warning'}>{dayClosed ? 'Closed' : 'Open'}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><label className="block text-xs text-slate-600 mb-1">Opening Cash (PKR)</label><input type="number" disabled={dayClosed} value={openingCash} onChange={(e) => setOpeningCash(Number(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
                    <div><label className="block text-xs text-slate-600 mb-1">Expenses (PKR)</label><input type="number" disabled={dayClosed} value={expenses} onChange={(e) => setExpenses(Number(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Collected Sales</span><span className="font-semibold">PKR {collectedSales.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Unpaid / Pending</span><span className="font-semibold">PKR {unpaidTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-base pt-1 border-t border-slate-200"><span>Expected Cash</span><span>PKR {expectedCash.toLocaleString()}</span></div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Actual Counted Cash (PKR)</label>
                    <input type="number" disabled={dayClosed} value={countedCash} onChange={(e) => setCountedCash(e.target.value)} placeholder="Enter counted cash..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                  {cashDiff !== null && (
                    <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm">
                      <span className="font-medium">Difference</span>
                      <span className={`font-bold ${cashDiff === 0 ? 'text-emerald-700' : cashDiff > 0 ? 'text-blue-700' : 'text-rose-700'}`}>{cashDiff > 0 ? '+' : ''}PKR {cashDiff.toLocaleString()}</span>
                    </div>
                  )}
                  <button type="button" disabled={dayClosed || !!actionState.dayClose} onClick={() => setConfirmClose(true)} className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-40 inline-flex items-center justify-center gap-2">
                    {actionState.dayClose && <Loader2 className="w-4 h-4 animate-spin" />}{dayClosed ? 'Day Closed' : actionState.dayClose ? 'Saving...' : 'Close Day'}
                  </button>
                  {confirmClose && !dayClosed && (
                    <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><AlertTriangle className="w-4 h-4 text-amber-600" /><span>Confirm day closing for PKR {expectedCash.toLocaleString()}?</span></div>
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setConfirmClose(false)} className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold">Cancel</button>
                        <button type="button" disabled={!!actionState.dayClose} onClick={saveDayClosing} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-2 disabled:opacity-50">{actionState.dayClose && <Loader2 className="w-3.5 h-3.5 animate-spin" />}Confirm</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Reports</h1>
                    <div className="flex gap-2">
                      <button type="button" disabled={!!actionState.exportCsv} onClick={exportCsv} className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50">{actionState.exportCsv ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} CSV</button>
                      <button type="button" onClick={() => window.print()} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5"><Printer className="w-3.5 h-3.5" /> Print</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200"><p className="text-xs text-slate-500">Gross Revenue</p><p className="text-2xl font-bold mt-1">PKR {grossSales.toLocaleString()}</p></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200"><p className="text-xs text-slate-500">Orders Count</p><p className="text-2xl font-bold mt-1">{orders.length}</p></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200"><p className="text-xs text-slate-500">Average Ticket</p><p className="text-2xl font-bold mt-1">PKR {orders.length ? Math.round(grossSales / orders.length).toLocaleString() : 0}</p></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200"><p className="text-xs text-slate-500">Collected</p><p className="text-xl font-bold mt-1 text-emerald-700">PKR {collectedSales.toLocaleString()}</p></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200"><p className="text-xs text-slate-500">Unpaid</p><p className="text-xl font-bold mt-1 text-rose-700">PKR {unpaidTotal.toLocaleString()}</p></div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200"><p className="text-xs text-slate-500">Pending Sync</p><p className="text-xl font-bold mt-1 text-amber-700">{pendingSync}</p></div>
                  </div>
                </div>
              )}              {activeTab === 'website' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-sm">RestroFlow Website</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ['home', 'Home'],
                        ['menu', 'Menu'],
                        ['reservations', 'Reservations'],
                        ['about', 'About'],
                        ['contact', 'Contact'],
                      ].map(([id, label]) => (
                        <button key={id} type="button" onClick={() => setWebSection(id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${webSection === id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{label}</button>
                      ))}
                    </div>
                    <button type="button" onClick={() => setWebCartOpen(true)} className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold">
                      <ShoppingCart className="w-3.5 h-3.5" /> Cart
                      {webCartQty > 0 && <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center min-w-[18px] h-[18px] px-1">{webCartQty}</span>}
                    </button>
                  </div>

                  {webSection === 'home' && (
                    <div className="space-y-8">
                      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 min-h-[280px] flex items-end">
                        <img src="/menu/hero-burger.jpg" alt="RestroFlow" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                        <div className="relative space-y-4 max-w-lg">
                          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Bold Flavors.<br />Calm Experience.</h1>
                          <p className="text-slate-300 text-sm sm:text-base">Order from our live demo menu, reserve a table, and track orders through POS, kitchen, and waiter screens.</p>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setWebSection('menu')} className="px-4 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-sm">View Menu</button>
                            <button type="button" onClick={() => setWebSection('reservations')} className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/30 text-white font-semibold text-sm hover:bg-white/20">Reserve Table</button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-end justify-between gap-3 mb-4">
                          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Featured Dishes</h2>
                          <button type="button" onClick={() => setWebSection('menu')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">View full menu</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {menu.slice(0, 3).map((dish) => (
                            <article key={dish.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
                              <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                                {dish.image && <img src={dish.image} alt={dish.name} className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />}
                              </div>
                              <div className="p-4 sm:p-5 flex flex-col flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <h3 className="font-semibold text-base text-slate-900 leading-snug">{dish.name}</h3>
                                  <span className="font-bold text-base text-slate-900 whitespace-nowrap">PKR {dish.price.toLocaleString()}</span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600 leading-5 line-clamp-2 min-h-[2.5rem]">{dish.description}</p>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end mt-auto">
                                  <button type="button" onClick={() => { addWebItem(dish); setWebSection('menu'); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
                                    <Plus className="w-4 h-4" /> Add
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {webSection === 'menu' && (
                    <div className="space-y-5">
                      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            {['All', 'Starters', 'Mains', 'Drinks', 'Desserts'].map((c) => {
                              const active = webCategory === c;
                              return (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => setWebCategory(c)}
                                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                    active
                                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900'
                                  }`}
                                >
                                  {c}
                                </button>
                              );
                            })}
                          </div>
                          <div className="relative w-full lg:w-80">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={webSearch}
                              onChange={(e) => setWebSearch(e.target.value)}
                              placeholder="Search dishes, drinks, or desserts..."
                              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                            />
                          </div>
                        </div>
                      </div>

                      {filteredWebMenu.length === 0 ? (
                        <EmptyState
                          title="No menu items match your search"
                          message="Try a different keyword or category, or clear your filters to browse the full menu."
                          actionLabel="Clear Search"
                          onAction={resetWebFilters}
                          icon={FilterX}
                        />
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                          {filteredWebMenu.map((dish) => {
                            const soldOut = dish.stock <= 0;
                            const lowStock = dish.stock > 0 && dish.stock <= 5;
                            return (
                              <article
                                key={dish.id}
                                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                              >
                                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                                  {dish.image ? (
                                    <img
                                      src={dish.image}
                                      alt={dish.name}
                                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Image unavailable</div>
                                  )}
                                  <div className="absolute top-3 left-3">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-slate-700 border border-slate-200 shadow-sm backdrop-blur-sm">
                                      {dish.category}
                                    </span>
                                  </div>
                                </div>

                                <div className="p-4 sm:p-5 flex flex-col flex-1">
                                  <div className="flex items-start justify-between gap-3">
                                    <h3 className="font-semibold text-base text-slate-900 leading-snug">{dish.name}</h3>
                                    <span className="font-bold text-base text-slate-900 whitespace-nowrap">PKR {dish.price.toLocaleString()}</span>
                                  </div>

                                  <p className="mt-2 text-sm text-slate-600 leading-5 line-clamp-2 min-h-[2.5rem]">
                                    {dish.description || 'Freshly prepared and served with care.'}
                                  </p>

                                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                                    <div className="text-xs font-medium">
                                      {soldOut ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-500">Sold out</span>
                                      ) : lowStock ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">Only {dish.stock} left</span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Available</span>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      disabled={soldOut}
                                      onClick={() => addWebItem(dish)}
                                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors shrink-0"
                                    >
                                      <Plus className="w-4 h-4" />
                                      <span>{soldOut ? 'Unavailable' : 'Add to Cart'}</span>
                                    </button>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  {webSection === 'reservations' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                        <h2 className="font-semibold text-base">Reserve a Table</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input type="text" value={resForm.name} onChange={(e) => setResForm({ ...resForm, name: e.target.value })} placeholder="Full name" className="px-3 py-2 text-sm border border-slate-300 rounded-lg sm:col-span-2" />
                          <input type="date" value={resForm.date} onChange={(e) => setResForm({ ...resForm, date: e.target.value })} className="px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                          <input type="time" value={resForm.time} onChange={(e) => setResForm({ ...resForm, time: e.target.value })} className="px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                          <input type="number" min="1" value={resForm.guests} onChange={(e) => setResForm({ ...resForm, guests: e.target.value })} placeholder="Guests" className="px-3 py-2 text-sm border border-slate-300 rounded-lg sm:col-span-2" />
                        </div>
                        <button type="button" disabled={!!actionState.reservation} onClick={placeReservation} className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2">
                          {actionState.reservation ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          <span>{actionState.reservation ? 'Saving...' : 'Request Reservation'}</span>
                        </button>
                        <p className="text-xs text-slate-500">Demo reservation requests are stored locally and visible instantly.</p>
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                        <h2 className="font-semibold text-base">Recent Reservations</h2>
                        {reservations.length === 0 ? (
                          <EmptyState title="No reservations yet" message="Submitted reservation requests will appear here for quick follow-up." />
                        ) : (
                          <div className="space-y-2">
                            {reservations.slice(0, 8).map((r) => (
                              <div key={r.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-sm">
                                <div>
                                  <p className="font-semibold">{r.name} <span className="text-slate-500 font-normal">({r.guests} guests)</span></p>
                                  <p className="text-xs text-slate-500">{r.date} at {r.time}</p>
                                </div>
                                <Badge tone={r.status === 'pending' ? 'warning' : 'success'}>{r.status}</Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {webSection === 'about' && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 max-w-3xl">
                      <h2 className="text-lg font-semibold">About RestroFlow</h2>
                      <p className="text-sm text-slate-600">RestroFlow is a frontend demo POS experience designed to showcase ordering, kitchen operations, table service, and back-office workflows in one interface.</p>
                      <p className="text-sm text-slate-600">This environment uses centralized local demo persistence so role changes, order updates, and offline sync states survive refreshes and stay consistent across screens.</p>
                    </div>
                  )}

                  {webSection === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-xl border border-slate-200"><p className="text-xs text-slate-500">Phone</p><p className="font-semibold mt-1">+92 300 1234567</p></div>
                      <div className="bg-white p-5 rounded-xl border border-slate-200"><p className="text-xs text-slate-500">Email</p><p className="font-semibold mt-1">hello@restroflow.demo</p></div>
                      <div className="bg-white p-5 rounded-xl border border-slate-200"><p className="text-xs text-slate-500">Hours</p><p className="font-semibold mt-1">12:00 PM ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ 11:30 PM</p></div>
                    </div>
                  )}

                  {webCartOpen && (
                    <div className="fixed inset-0 z-50">
                      <div className="absolute inset-0 bg-slate-950/40" onClick={() => setWebCartOpen(false)} />
                      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                          <h3 className="font-semibold text-base">Website Cart</h3>
                          <button type="button" onClick={() => setWebCartOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {webCart.length === 0 ? (
                            <EmptyState title="Your cart is empty" message="Add menu items to place a website order." icon={ShoppingCart} />
                          ) : (
                            webCart.map((item) => (
                              <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200">
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">{item.name}</p>
                                  <p className="text-xs text-slate-500">PKR {(item.price * item.qty).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button type="button" onClick={() => stepWebQty(item.id, -1)} className="w-7 h-7 rounded border border-slate-300 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                                  <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                                  <button type="button" onClick={() => stepWebQty(item.id, 1)} className="w-7 h-7 rounded border border-slate-300 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="p-4 border-t border-slate-200 space-y-3">
                          <div className="flex items-center justify-between text-sm"><span className="text-slate-600">Subtotal</span><span className="font-bold">PKR {webCartTotal.toLocaleString()}</span></div>
                          {!isOnline && <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5">Offline: checkout will be queued as pending and synced when back online.</div>}
                          <button type="button" disabled={webCart.length === 0 || !!actionState.webCheckout} onClick={checkoutWebsite} className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-40 inline-flex items-center justify-center gap-2">
                            {actionState.webCheckout ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            <span>{actionState.webCheckout ? 'Placing Order...' : isOnline ? 'Place Order' : 'Queue Order for Sync'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-[60] max-w-sm w-[calc(100%-2rem)]">
          <div className={`rounded-xl border px-4 py-3 shadow-lg flex items-start gap-3 ${
            toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' :
            toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
            'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> :
             toast.type === 'warning' ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> :
             <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button type="button" onClick={() => setToast(null)} className="p-0.5 rounded hover:bg-black/5"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
