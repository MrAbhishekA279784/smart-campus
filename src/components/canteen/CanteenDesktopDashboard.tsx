import React, { useState, useEffect } from 'react';
import {
  Utensils,
  ClipboardList,
  Package,
  CreditCard,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  Search,
  Bell,
  LogOut,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Coffee,
  Check,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CURRENT_CANTEEN } from '../../data/mockData';
import { api } from '../../lib/api';

export const CanteenDesktopDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'preparing' | 'ready'>('all');
  const [activeSection, setActiveSection] = useState<'orders' | 'menu' | 'analytics'>('orders');

  const [orders, setOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(30);
  const [newItemCategory, setNewItemCategory] = useState('Snacks');
  const [newItemImage, setNewItemImage] = useState('');

  const loadCanteenData = () => {
    setIsLoading(true);
    Promise.all([
      api.canteen.getQueue(),
      api.canteen.getMenu()
    ])
      .then(([queueRes, menuRes]) => {
        setOrders(queueRes.orders || []);
        setMenuItems(menuRes.menu || []);
      })
      .catch(console.warn)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCanteenData();
    const interval = setInterval(loadCanteenData, 10000); // Live poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.canteen.updateStatus(orderId, newStatus);
      loadCanteenData();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const toggleStock = async (item: any) => {
    try {
      await api.canteen.updateMenuItem(item.id, { is_available: !item.isAvailable });
      loadCanteenData();
    } catch (err: any) {
      alert(err.message || 'Failed to update item availability');
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      await api.canteen.addMenuItem({
        name: newItemName,
        price: Number(newItemPrice),
        category: newItemCategory,
        image: newItemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
        isAvailable: true
      });
      alert(`"${newItemName}" added to the live menu!`);
      setShowAddModal(false);
      setNewItemName('');
      setNewItemPrice(30);
      loadCanteenData();
    } catch (err: any) {
      alert(err.message || 'Failed to add menu item');
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (activeTab === 'preparing') return ord.status === 'PREPARING' || ord.status === 'PENDING';
    if (activeTab === 'ready') return ord.status === 'READY';
    return ord.status !== 'COMPLETED';
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0) + 28450;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      {/* Left Sidebar matching canteen.png */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 tracking-tight leading-tight">Smart Sathaye Campus</h2>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider">CANTEEN & PANTRY DESK</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'orders', label: 'Live Kitchen Orders', icon: Utensils },
              { id: 'menu', label: 'Menu & Stock Control', icon: ClipboardList },
              { id: 'analytics', label: 'Revenue & Analytics', icon: TrendingUp }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quote Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-2xl bg-gradient-to-b from-orange-50/70 to-slate-100 p-3.5 border border-orange-100 mb-3">
            <p className="text-[11px] italic text-slate-700 font-serif leading-snug">
              “Good food is the foundation of genuine happiness.”
            </p>
            <p className="text-[10px] font-semibold text-orange-700 mt-1.5">— Auguste Escoffier</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search active orders, tokens, menu items..."
              className="w-full pl-10 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadCanteenData}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Refresh Queue"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xs">
                CS
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{CURRENT_CANTEEN.name}</p>
                <p className="text-[10px] text-slate-500">{CURRENT_CANTEEN.canteenRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Welcome Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Good Afternoon, Canteen Staff! <span className="text-2xl">👋</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Live Kitchen Operations & Counter Pickup Screen</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">Tuesday, 26 August 2026</p>
                <p className="text-[11px] text-emerald-600 font-bold">Kitchen Status: OPEN • Live Syncing</p>
              </div>

              <div className="max-w-xs bg-orange-50/80 border border-orange-200/80 rounded-xl p-2.5 hidden lg:block">
                <p className="text-[11px] italic text-orange-950 font-serif leading-tight">
                  “Food is maybe the only universal thing that brings everyone together.”
                </p>
                <p className="text-[10px] text-orange-700 font-semibold mt-0.5">— Guy Fieri</p>
              </div>
            </div>
          </div>

          {/* 4 Stats Cards matching canteen.png */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Orders in Queue</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{orders.filter((o) => o.status !== 'COMPLETED').length}</h3>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">Live tokens pending</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Revenue Today</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalRevenue.toLocaleString()}</h3>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">Cash + Sathaye UPI</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                ₹
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Active Menu Items</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{menuItems.filter((m) => m.isAvailable).length}</h3>
                <p className="text-[11px] text-amber-600 font-semibold mt-1">{menuItems.length} total dishes</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Top Popular Item</p>
                <h3 className="text-xl font-black text-slate-900 mt-1">Masala Dosa</h3>
                <p className="text-[11px] text-rose-600 font-semibold mt-1">86 orders today</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* SECTION 1: LIVE ORDERS QUEUE */}
          {activeSection === 'orders' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Orders Section (2 columns wide) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900">Live Kitchen Order Queue</h3>
                  <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                    {[
                      { id: 'all', label: `Active (${orders.filter((o) => o.status !== 'COMPLETED').length})` },
                      { id: 'preparing', label: `Preparing (${orders.filter((o) => o.status === 'PREPARING' || o.status === 'PENDING').length})` },
                      { id: 'ready', label: `Ready (${orders.filter((o) => o.status === 'READY').length})` }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          activeTab === tab.id
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    No active orders in this view. Next token will display here automatically!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          ord.status === 'READY'
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-white border-slate-200/80 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-sm shrink-0 shadow-xs ${
                              ord.status === 'READY'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-orange-500 text-white'
                            }`}
                          >
                            <span className="text-[9px] font-sans font-bold tracking-wider uppercase opacity-80">TOKEN</span>
                            <span>#{ord.token_number}</span>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{ord.items_summary}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span>Student: <strong className="text-slate-800">{ord.student_name}</strong></span>
                              <span>•</span>
                              <span>Paid: <strong className="text-slate-900">₹{ord.total_amount}</strong> ({ord.payment_method})</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {ord.status !== 'READY' ? (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'READY')}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                            >
                              Call Ready (Pickup)
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'COMPLETED')}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>Handed Over</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Side: Quick Stock & Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Quick Stock Toggle</h3>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="space-y-2">
                    {menuItems.slice(0, 7).map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-500">₹{item.price}</p>
                        </div>
                        <button
                          onClick={() => toggleStock(item)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            item.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Sold Out'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: MENU MANAGEMENT */}
          {activeSection === 'menu' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Menu Catalog & Dish Pricing</h2>
                  <p className="text-xs text-slate-500">Manage all dishes served in the Sathaye College student and staff cafeteria</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex gap-4 items-center justify-between">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{item.name}</h4>
                      <p className="text-xs font-bold text-orange-600 mt-0.5">₹{item.price}</p>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{item.category}</span>
                      <button
                        onClick={() => toggleStock(item)}
                        className={`mt-2 px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                          item.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {item.isAvailable ? 'Available ✓' : 'Sold Out ✕'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Menu Item Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleAddMenuItem} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Add New Dish to Menu</h3>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masala Dosa Special"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="South Indian">South Indian</option>
                    <option value="Meals & Thali">Meals & Thali</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Photo Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Add to Menu
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
