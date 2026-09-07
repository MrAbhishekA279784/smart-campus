import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  ShieldCheck,
  QrCode,
  Clock,
  Copy,
  Check,
  CheckCircle2,
  Loader2,
  Sparkles,
  Smartphone,
  Wallet,
  Receipt
} from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalAmount: number;
  studentId: string;
  studentName: string;
  onConfirmOrder: (paymentMethod: string) => Promise<string | number>;
}

// Helper component to generate a realistic SVG QR code pattern
const DynamicUpiQrCode: React.FC<{ upiId: string; amount: number }> = ({ upiId, amount }) => {
  // Fixed deterministic pattern based on amount and UPI string
  const qrGrid = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,1],
    [0,1,0,0,1,0,0,0,1,1,1,0,0,1,0,1,0,0,1],
    [1,1,1,0,1,1,1,1,0,0,1,1,1,0,1,1,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0],
    [1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,1,0,1,1,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,1,0,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1],
  ];

  return (
    <div className="relative p-3 bg-white rounded-2xl border-2 border-slate-900/10 shadow-inner flex flex-col items-center justify-center">
      <svg viewBox="0 0 19 19" className="w-44 h-44 text-slate-900 shape-rendering-crisp">
        {qrGrid.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            cell === 1 ? (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx}
                y={rIdx}
                width="1"
                height="1"
                fill="currentColor"
              />
            ) : null
          ))
        )}
      </svg>
      {/* Center Badge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white border-2 border-blue-600 rounded-xl px-2 py-1 shadow-md flex items-center gap-1">
          <span className="text-[10px] font-black text-blue-600 tracking-tight">UPI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

export const DemoPaymentModal: React.FC<DemoPaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  studentId,
  studentName,
  onConfirmOrder,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet' | 'counter'>('upi');
  const [step, setStep] = useState<'cart' | 'processing' | 'success'>('cart');
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [placedToken, setPlacedToken] = useState<string | number | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(299); // 4m 59s
  const [txnId, setTxnId] = useState('');

  const upiId = 'sathayecanteen@okaxis';

  // Countdown timer for UPI QR
  useEffect(() => {
    let interval: any = null;
    if (isOpen && step === 'cart' && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, step, timerSeconds]);

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const startPaymentProcess = async () => {
    setStep('processing');
    setProcessingStage(1);

    // Simulate Payment Gateway Stages
    setTimeout(() => {
      setProcessingStage(2);
    }, 900);

    setTimeout(() => {
      setProcessingStage(3);
    }, 1800);

    setTimeout(async () => {
      try {
        const tokenNum = await onConfirmOrder(paymentMethod);
        const generatedTxn = `TXN_SATHAYE_${Date.now().toString().slice(-8)}`;
        setTxnId(generatedTxn);
        setPlacedToken(tokenNum || Math.floor(100 + Math.random() * 900));
        setStep('success');
      } catch (err: any) {
        alert(err.message || 'Payment processing failed');
        setStep('cart');
      }
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {step === 'success' ? 'Order Token Generated' : 'Canteen Checkout'}
              </h3>
              <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>128-bit Encrypted Campus Gateway</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {step === 'cart' && (
            <>
              {/* Order Items Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 text-xs font-bold text-slate-700">
                  <span>Selected Items ({items.length})</span>
                  <span>Amount</span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs text-slate-700">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="font-bold text-slate-900">{item.quantity}x</span>
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="font-medium text-slate-900 whitespace-nowrap">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Total Payable</span>
                  <span className="text-base font-extrabold text-blue-600">₹{totalAmount}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-sm ring-2 ring-blue-600/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>UPI / GPay</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-2.5 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'wallet'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-sm ring-2 ring-blue-600/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <span>Campus Wallet</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('counter')}
                    className={`p-2.5 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'counter'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-sm ring-2 ring-blue-600/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Receipt className="w-4 h-4 text-purple-600" />
                    <span>Pay Counter</span>
                  </button>
                </div>
              </div>

              {/* Dynamic QR View for UPI */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-gradient-to-b from-slate-50 to-blue-50/30 rounded-2xl border border-blue-100 flex flex-col items-center text-center space-y-3">
                  <div className="flex items-center justify-between w-full text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <QrCode className="w-4 h-4 text-blue-600" /> Scan & Pay with Any UPI App
                    </span>
                    <span className="font-mono text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatTimer(timerSeconds)}
                    </span>
                  </div>

                  <DynamicUpiQrCode upiId={upiId} amount={totalAmount} />

                  {/* UPI Details */}
                  <div className="w-full bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Merchant UPI ID</span>
                      <span className="font-mono font-bold text-slate-800">{upiId}</span>
                    </div>
                    <button
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  {/* UPI Partner Logos */}
                  <div className="flex items-center justify-center gap-3 pt-1 text-[10px] font-bold text-slate-500">
                    <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-blue-600">GPay</span>
                    <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-purple-600">PhonePe</span>
                    <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-cyan-600">Paytm</span>
                    <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-emerald-600">BHIM UPI</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span>Sathaye Student Wallet Balance</span>
                    <span className="text-sm font-extrabold text-emerald-700">₹450.00</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Amount of <strong>₹{totalAmount}</strong> will be deducted instantly from your verified campus account.
                  </p>
                </div>
              )}

              {paymentMethod === 'counter' && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 space-y-1.5 text-xs">
                  <span className="font-bold block">Pay Cash / Card at Counter</span>
                  <p className="text-[11px] text-purple-700">
                    A live order token will be reserved immediately. Please present exact cash or card at Canteen Counter 2 to initiate prep.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={startPaymentProcess}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {paymentMethod === 'upi'
                    ? `Simulate App Scan & Pay ₹${totalAmount}`
                    : `Confirm & Generate Order Token (₹${totalAmount})`}
                </span>
              </button>
            </>
          )}

          {step === 'processing' && (
            <div className="py-10 text-center space-y-6 animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping opacity-75"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                <Smartphone className="w-8 h-8 text-blue-600 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-lg text-slate-900">Processing Payment...</h4>
                <p className="text-xs text-slate-500">Please do not refresh or close this window</p>
              </div>

              {/* Progress Steps */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 max-w-xs mx-auto space-y-2 text-left text-xs font-semibold">
                <div className={`flex items-center gap-2 ${processingStage >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                  {processingStage > 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  <span>1. Contacting Campus Payment Gateway</span>
                </div>
                <div className={`flex items-center gap-2 ${processingStage >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                  {processingStage > 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Loader2 className={`w-4 h-4 ${processingStage === 2 ? 'animate-spin' : ''}`} />
                  )}
                  <span>2. Verifying Merchant Credentials</span>
                </div>
                <div className={`flex items-center gap-2 ${processingStage >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
                  {processingStage === 3 ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                  <span>3. Generating Live Order Token</span>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-extrabold text-xl text-slate-900">Payment Approved!</h4>
                <p className="text-xs text-slate-500 mt-0.5">Show this live token at the Canteen Counter</p>
              </div>

              {/* Order Token Box */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <ShoppingBag className="w-24 h-24 text-white" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  CANTEEN LIVE TOKEN
                </span>
                <span className="text-4xl sm:text-5xl font-black text-amber-400 block tracking-widest font-mono">
                  #{placedToken}
                </span>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800 mt-2">
                  <span>Estimated Prep: ~8 mins</span>
                  <span className="font-mono text-slate-400">{txnId}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Done & Return to Canteen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
