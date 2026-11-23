export const MENU_ITEMS = [
  {
    id: 'm1',
    name: 'Classic Smash Burger',
    category: 'Mains',
    price: 950,
    stock: 24,
    prepMins: 12,
    description: 'Seared beef patty, melted cheese, house sauce, and toasted bun.',
    image: '/menu/classic-smash-burger.jfif',
    addons: ['Extra Cheese (+150)', 'Jalapenos (+90)'],
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
    addons: ['Garlic Dip (+80)', 'Spicy Glaze (+100)'],
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
    addons: ['Extra Chicken (+250)', 'Avocado (+180)'],
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
    addons: ['Parmesan (+120)'],
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
    addons: ['Oat Milk (+110)', 'Extra Shot (+130)'],
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
    addons: ['Vanilla Scoop (+160)'],
  },
];

export const INITIAL_TABLES = [
  { id: 'T-01', name: 'Table 01', seats: 2, status: 'available', waiter: 'Ali', total: 0, elapsedMins: 0 },
  { id: 'T-02', name: 'Table 02', seats: 4, status: 'occupied', waiter: 'Sara', total: 2460, elapsedMins: 22 },
  { id: 'T-03', name: 'Table 03', seats: 4, status: 'ready', waiter: 'Ali', total: 1890, elapsedMins: 16 },
  { id: 'T-04', name: 'Table 04', seats: 6, status: 'occupied', waiter: 'Bilal', total: 4120, elapsedMins: 35 },
  { id: 'T-05', name: 'Table 05', seats: 2, status: 'available', waiter: 'Sara', total: 0, elapsedMins: 0 },
  { id: 'T-06', name: 'Table 06', seats: 6, status: 'ready', waiter: 'Bilal', total: 3250, elapsedMins: 19 },
];

export const INITIAL_ORDERS = [
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
    kitchenStatus: 'preparing', // 'new' | 'preparing' | 'ready'
    serveStatus: 'waiting',     // 'waiting' | 'picked_up' | 'served'
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
    items: [
      { name: 'Loaded Truffle Fries', qty: 2, price: 540, note: 'Extra crispy' },
    ],
    total: 1080,
    paid: true,
    kitchenStatus: 'new',
    serveStatus: 'waiting',
    elapsedMins: 3,
    synced: true,
  },
];

export const INVENTORY_ROWS = [
  { id: 'INV-1', item: 'Brioche Buns', unit: 'pcs', onHand: 42, minStock: 20, costPerUnit: 85 },
  { id: 'INV-2', item: 'Chicken Fillet', unit: 'kg', onHand: 4.5, minStock: 6, costPerUnit: 920 },
  { id: 'INV-3', item: 'Coffee Beans', unit: 'kg', onHand: 3.2, minStock: 2, costPerUnit: 3400 },
  { id: 'INV-4', item: 'Truffle Oil', unit: 'bottles', onHand: 1, minStock: 3, costPerUnit: 1650 },
];

export const STAFF_ROWS = [
  { id: 'STF-1', name: 'Ali Raza', role: 'Waiter', shift: '12:00 PM - 8:00 PM', status: 'Checked In' },
  { id: 'STF-2', name: 'Sara Khan', role: 'Waiter', shift: '2:00 PM - 10:00 PM', status: 'Checked In' },
  { id: 'STF-3', name: 'Usman Tariq', role: 'Cashier', shift: '12:00 PM - 8:00 PM', status: 'Checked In' },
  { id: 'STF-4', name: 'Bilal Ahmed', role: 'Kitchen Lead', shift: '11:00 AM - 7:00 PM', status: 'On Break' },
];