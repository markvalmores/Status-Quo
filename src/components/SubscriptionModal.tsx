import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  Sparkles,
  CheckCircle2,
  X,
  Shield,
  Smartphone,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [method, setMethod] = useState<'paypal' | 'gcash'>('paypal');
  const [gcashPhone, setGcashPhone] = useState('0917-123-4567');
  const [gcashOtp, setGcashOtp] = useState('');
  const [step, setStep] = useState<'select' | 'processing' | 'done'>('select');

  if (!isOpen) return null;

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('done');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 }
      });
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep('select');
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#120c22] border border-[#3e276b] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-purple-950/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#291a47] flex items-center justify-between bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
              <Sparkles className="w-5 h-5 fill-yellow-400" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-yellow-300">
                Status Quo VIP Pass
              </h2>
              <p className="text-xs text-zinc-300">
                Monthly Subscription for Unlimited Posts & Celebrity Clout
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#251747] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'processing' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="font-bold text-lg text-zinc-100">
              Processing {method === 'paypal' ? 'PayPal' : 'GCash'} Payment...
            </h3>
            <p className="text-xs text-zinc-400">
              Securing connection with encrypted gateway. One moment!
            </p>
          </div>
        ) : step === 'done' ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h3 className="font-extrabold text-xl text-yellow-400">
              VIP Pass Activated!
            </h3>
            <p className="text-xs text-zinc-300">
              You now have unlimited energy and posts everyday! Enjoy the spotlight!
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            {/* VIP Perks */}
            <div className="bg-[#18102d] border border-[#3b276b] rounded-xl p-3.5 space-y-2 text-xs">
              <div className="font-bold text-yellow-300 uppercase tracking-wider text-[11px]">
                Included in VIP Pass ($4.99 / mo or ₱249 / mo):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>∞ Unlimited Posts Everyday</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No Energy Drain</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>2x Celebrity Algorithm Boost</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant Golden VIP Badge</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector (PayPal vs GCash) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Select Payment Method:</label>
              <div className="grid grid-cols-2 gap-3">
                {/* PayPal option */}
                <button
                  type="button"
                  onClick={() => setMethod('paypal')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    method === 'paypal'
                      ? 'bg-[#003087]/20 border-[#0079C1] text-sky-300 ring-2 ring-[#0079C1]'
                      : 'bg-[#18102d] border-[#36235b] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-xs">PayPal</span>
                  <span className="text-[10px] text-zinc-400">$4.99 / month</span>
                </button>

                {/* GCash option */}
                <button
                  type="button"
                  onClick={() => setMethod('gcash')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    method === 'gcash'
                      ? 'bg-blue-600/20 border-blue-400 text-blue-300 ring-2 ring-blue-500'
                      : 'bg-[#18102d] border-[#36235b] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-xs">GCash</span>
                  <span className="text-[10px] text-zinc-400">₱249 / month</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {method === 'paypal' ? (
              <div className="bg-[#100a1c] border border-[#2b1b47] rounded-xl p-3 text-xs space-y-2">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>PayPal Express Checkout</span>
                  <span className="font-mono text-yellow-300">$4.99 USD</span>
                </div>
                <div className="text-[11px] text-zinc-500">
                  Recurring monthly subscription. Cancel anytime from your account settings.
                </div>
              </div>
            ) : (
              <div className="bg-[#100a1c] border border-[#2b1b47] rounded-xl p-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>GCash Direct Debit</span>
                  <span className="font-mono text-yellow-300">₱249.00 PHP</span>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">
                    Registered GCash Mobile Number:
                  </label>
                  <input
                    type="text"
                    value={gcashPhone}
                    onChange={(e) => setGcashPhone(e.target.value)}
                    className="w-full bg-[#18102d] border border-[#3b276b] rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-extrabold text-sm shadow-xl shadow-yellow-500/20 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 fill-black" />
              <span>Confirm & Subscribe via {method === 'paypal' ? 'PayPal ($4.99)' : 'GCash (₱249)'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
