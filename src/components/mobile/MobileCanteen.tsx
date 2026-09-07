import React, { useState } from 'react';
import { ArrowLeft, Search, Star, ShoppingBag, Plus, Minus } from 'lucide-react';
import { CANTEEN_MENU } from '../../data/mockData';
import { DemoPaymentModal } from '../common/DemoPaymentModal';
import { api } from '../../lib/api';

interface MobileCanteenProps {
  onBack: () => void;
}

export const MobileCanteen: React.FC<MobileCanteenProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Breakfast' | 'Lunch' | 'Snacks' | 'Beverages'>('All');
  const [cartItems, setCartItems] = useState<Record<string, number>>({
    'cnt-1': 1, // Masala Dosa
    'cnt-2': 1, // Veg Thali
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'] as const;

  const filteredItems = CANTEEN_MENU.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const addToCart = (id: string) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const totalCount = (Object.values(cartItems) as number[]).reduce((sum, count) => sum + count, 0);
  const totalPrice = (Object.entries(cartItems) as [string, number][]).reduce((acc, [id, qty]) => {
    const item = CANTEEN_MENU.find((i) => i.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const cartItemsList = Object.entries(cartItems).map(([id, qty]) => {
    const item = CANTEEN_MENU.find((i) => i.id === id);
    return {
      id,
      name: item?.name || 'Canteen Item',
      price: item?.price || 0,
      quantity: qty,
    };
  });

  const handleConfirmOrder = async (paymentMethod: string): Promise<string | number> => {
    const items = Object.entries(cartItems).map(([itemId, quantity]) => ({ itemId, quantity }));
    try {
      const res = await api.canteen.placeOrder({
        studentId: 'a13698dc-ee1d-4d73-9302-b68e1df153cc',
        studentName: 'Abhishek Gupta',
        items,
        paymentMethod
      });
      setCartItems({});
      return res.tokenNumber;
    } catch (err) {
      const fallbackToken = Math.floor(1000 + Math.random() * 9000);
      setCartItems({});
      return fallbackToken;
    }
  };

  return (
    <div id="mobile-canteen-screen" className="pb-28 pt-2 bg-[#f8fafc] min-h-screen">
      {/* 1. Header Bar */}
      <div className="px-4 py-2 flex items-center justify-between bg-white border-b border-slate-200/80 sticky top-0 z-20">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-slate-900">Canteen</h2>
        <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Main Canteen Live Status Banner */}
      <div className="p-4">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80"
              alt="Main Canteen"
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">Main Canteen</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                  Open
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">8:00 AM – 6:00 PM</p>
              <p className="text-[11px] font-medium text-emerald-600 mt-0.5 flex items-center gap-1">
                <span>⚡ Live Queue</span>
                <span className="text-slate-500">~12 people</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Chips */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Menu Items List */}
      <div className="px-4 space-y-3">
        {filteredItems.map((item) => {
          const qtyInCart = cartItems[item.id] || 0;

          return (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-2xs"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">₹ {item.price}</p>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800">{item.rating}</span>
                    <span>({item.ratingCount})</span>
                  </div>
                </div>
              </div>

              {/* Add + Button */}
              <button
                onClick={() => addToCart(item.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 ${
                  qtyInCart > 0
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                <span>Add</span>
                <span>+</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 5. Floating Bottom Cart Bar */}
      {totalCount > 0 && (
        <div className="fixed bottom-16 left-4 right-4 z-20">
          <div className="bg-blue-600 text-white p-3.5 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-between animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <ShoppingBag className="w-4 h-4" />
              <span>{totalCount} items</span>
              <span className="opacity-60">|</span>
              <span>₹ {totalPrice}</span>
            </div>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="text-xs font-bold text-white flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View Cart & Pay</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* DEMO PAYMENT & TOKEN MODAL */}
      <DemoPaymentModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItemsList}
        totalAmount={totalPrice}
        studentId="a13698dc-ee1d-4d73-9302-b68e1df153cc"
        studentName="Abhishek Gupta"
        onConfirmOrder={handleConfirmOrder}
      />
    </div>
  );
};
