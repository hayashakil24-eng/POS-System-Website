import React, { useMemo, useState } from 'react';
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

export default function CustomerWebsite({
  menuItems,
  isOnline,
  onPlaceWebsiteOrder,
  onCreateReservation,
  reservations,
}) {
  const [section, setSection] = useState('home'); // 'home' | 'menu' | 'reservations' | 'about' | 'contact'
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Cart & Checkout state
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState('Delivery'); // 'Delivery' | 'Pickup'
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery'); // 'Cash on Delivery' | 'Card / Online'
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Table Reservation state
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resGuests, setResGuests] = useState(4);
  const [resDate, setResDate] = useState('2026-11-24');
  const [resTime, setResTime] = useState('8:00 PM');
  const [resNote, setResNote] = useState('');
  const [resSuccess, setResSuccess] = useState('');

  const categories = ['All', 'Starters', 'Mains', 'Drinks', 'Desserts'];

  const bestSellers = useMemo(
    () => menuItems.filter((item) => item.stock > 0).slice(0, 3),
    [menuItems]
  );

  const filteredDishes = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = category === 'All' || item.category === category;
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, category, search]);

  const addItem = (item) => {
    if (item.stock <= 0) return;
    setConfirmedOrder(null);
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (found) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryFee = fulfillment === 'Delivery' && subtotal > 0 ? 200 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (cart.length === 0) {
      setFormError('Please add at least one item to your order bag.');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Please enter your name and contact number.');
      return;
    }
    if (fulfillment === 'Delivery' && !deliveryAddress.trim()) {
      setFormError('Please enter your delivery address.');
      return;
    }

    const created = onPlaceWebsiteOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: fulfillment === 'Delivery' ? deliveryAddress.trim() : 'Store Pickup',
      fulfillment,
      paymentMethod,
      items: cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price, note: '' })),
      subtotal,
      deliveryFee,
      tax,
      total,
    });

    setConfirmedOrder(created);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setCartOpen(false);
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    if (!resName.trim() || !resPhone.trim()) return;
    onCreateReservation({
      id: `RSV-${201 + reservations.length}`,
      name: resName.trim(),
      phone: resPhone.trim(),
      guests: Number(resGuests),
      date: resDate,
      time: resTime,
      note: resNote.trim(),
      status: 'Confirmed',
    });
    setResSuccess(`Table reservation request received for ${resName.trim()} (${resGuests} guests at ${resTime}).`);
    setResName('');
    setResPhone('');
    setResNote('');
  };

  return (
    <div className="space-y-6">
      {/* Website Sub-Navigation + Cart Trigger */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            ['home', 'Home'],
            ['menu', 'Menu & Order'],
            ['reservations', 'Reservations'],
            ['about', 'About'],
            ['contact', 'Contact'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                section === key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCartOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Order Bag ({cartCount})</span>
          {subtotal > 0 && (
            <span className="text-amber-300">• PKR {subtotal.toLocaleString()}</span>
          )}
        </button>
      </div>

      {/* Live POS Sync Status Notice for Website Orders */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
        <span>
          <strong>Website-to-POS Link:</strong> Orders placed here send directly to POS &amp; Kitchen
          Display.
        </span>
        <StatusBadge
          kind={isOnline ? 'paid' : 'preparing'}
          customLabel={isOnline ? 'POS Live & Connected' : 'POS Offline (Queued in Cloud)'}
        />
      </div>

      {/* Order Confirmation Banner */}
      {confirmedOrder && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-950">
              <p className="font-bold">
                Order Confirmed — {confirmedOrder.id} (PKR {confirmedOrder.total.toLocaleString()})
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                {confirmedOrder.fulfillment} • Payment: {confirmedOrder.paymentMethod} • Sent to
                POS &amp; Kitchen queue.
              </p>
            </div>
          </div>
          <button
            onClick={() => setConfirmedOrder(null)}
            className="text-emerald-800 hover:text-emerald-950 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HOME VIEW */}
      {section === 'home' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5" /> Freshly Prepared • Dine-In, Pickup &amp; Delivery
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Fresh meals, fast table service, and effortless online ordering.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                Browse our daily menu, order for delivery or pickup in seconds, or reserve a table
                for your next visit.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={() => setSection('menu')}
                  className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                >
                  Order Online
                </button>
                <button
                  onClick={() => setSection('reservations')}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50"
                >
                  Book a Table
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <img
                src="/menu/hero-burger.jpg"
                alt="Signature restaurant burger and sides"
                className="w-full h-64 object-cover rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Best Sellers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Best Sellers</h2>
              <button
                onClick={() => setSection('menu')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 underline"
              >
                View Full Menu
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bestSellers.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-40 object-contain bg-slate-50 border-b border-slate-100 p-3"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-base text-slate-900">{dish.name}</h3>
                        <span className="font-bold text-sm text-slate-900 shrink-0">
                          PKR {dish.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{dish.description}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => {
                        addItem(dish);
                        setCartOpen(true);
                      }}
                      className="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                    >
                      Add to Order Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MENU & ONLINE ORDERING VIEW */}
      {section === 'menu' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    category === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {filteredDishes.length === 0 ? (
            <div className="bg-white p-10 rounded-xl border border-slate-200 text-center space-y-2">
              <p className="font-semibold text-slate-800">No items found</p>
              <p className="text-xs text-slate-500">Try clearing your search or selecting All.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDishes.map((dish) => {
                const soldOut = dish.stock <= 0;
                return (
                  <div
                    key={dish.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-40 object-contain bg-slate-50 border-b border-slate-100 p-3"
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-semibold uppercase text-slate-400">
                              {dish.category}
                            </span>
                            <h3 className="font-semibold text-base text-slate-900">{dish.name}</h3>
                          </div>
                          <span className="font-bold text-sm text-slate-900">
                            PKR {dish.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{dish.description}</p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500">
                        {soldOut ? 'Sold Out' : `~${dish.prepMins} mins`}
                      </span>
                      <button
                        disabled={soldOut}
                        onClick={() => addItem(dish)}
                        className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {soldOut ? 'Unavailable' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* RESERVATIONS VIEW */}
      {section === 'reservations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleReservationSubmit}
            className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 space-y-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Reserve a Table</h2>
              <p className="text-xs text-slate-500">
                Choose your preferred date, time, and party size.
              </p>
            </div>

            {resSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900">
                {resSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  placeholder="e.g. Ayesha Siddiqui"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={resPhone}
                  onChange={(e) => setResPhone(e.target.value)}
                  placeholder="0300-0000000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guests</label>
                <select
                  value={resGuests}
                  onChange={(e) => setResGuests(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {[2, 4, 6, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} Guests
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={resDate}
                    onChange={(e) => setResDate(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <select
                    value={resTime}
                    onChange={(e) => setResTime(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {['1:30 PM', '3:00 PM', '7:30 PM', '8:00 PM', '9:30 PM'].map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Seating Note (Optional)
              </label>
              <input
                type="text"
                value={resNote}
                onChange={(e) => setResNote(e.target.value)}
                placeholder="Near window, high chair needed..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              Confirm Table Request
            </button>
          </form>

          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-semibold text-sm text-slate-900">Recent Bookings</h3>
            {reservations.length === 0 ? (
              <p className="text-xs text-slate-500">No table bookings yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {reservations.map((r) => (
                  <div key={r.id} className="py-2.5 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {r.name} • {r.guests} Guests
                      </p>
                      <p className="text-slate-500">
                        {r.date} at {r.time}
                      </p>
                    </div>
                    <StatusBadge kind="paid" customLabel={r.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABOUT VIEW */}
      {section === 'about' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 max-w-3xl">
          <h2 className="text-xl font-semibold text-slate-900">About Our Kitchen</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We focus on consistent ingredients, clean preparation, and attentive service across
            dine-in tables, express pickup, and home delivery. Every order placed online connects
            directly with our floor and kitchen workflow for accurate timing.
          </p>
        </div>
      )}

      {/* CONTACT VIEW */}
      {section === 'contact' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Location</p>
              <p className="text-xs text-slate-500">Main Dining &amp; Pickup Counter</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Phone</p>
              <p className="text-xs text-slate-500">+92 300 0000000</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Hours</p>
              <p className="text-xs text-slate-500">Daily • 12:00 PM – 11:30 PM</p>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER ORDER BAG & CHECKOUT DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-5 shadow-xl flex flex-col justify-between overflow-y-auto">
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="font-bold text-base text-slate-900">Your Order &amp; Checkout</h2>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">
                  Your order bag is empty. Add items from the menu.
                </p>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          PKR {(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => changeQty(item.id, -1)}
                          className="w-7 h-7 rounded bg-white border border-slate-300 flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => changeQty(item.id, 1)}
                          className="w-7 h-7 rounded bg-white border border-slate-300 flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery vs Pickup */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
                {['Delivery', 'Pickup'].map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setFulfillment(mode)}
                    className={`py-1.5 text-xs font-semibold rounded-md ${
                      fulfillment === mode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Customer Details */}
              <div className="space-y-2.5 text-sm">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Full Name *"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Mobile Number *"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
                {fulfillment === 'Delivery' && (
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Street / House / Area Address *"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Cash on Delivery', 'Card / Online'].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-2.5 rounded-lg border text-xs font-semibold ${
                        paymentMethod === method
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transparent Totals */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>PKR {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (5%)</span>
                  <span>PKR {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Payable</span>
                  <span>PKR {total.toLocaleString()}</span>
                </div>
              </div>

              {formError && (
                <p className="text-xs font-semibold text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
              >
                Place Order • PKR {total.toLocaleString()}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}