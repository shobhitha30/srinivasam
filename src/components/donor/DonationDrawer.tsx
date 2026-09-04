import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building2, RefreshCcw, Info, Check, X, ShieldCheck } from 'lucide-react';
import { Modal, Button, Input, Badge } from '../ui';
import { formatINR, toUSD } from '../../lib/utils';
import type { Requirement, PaymentMode } from '../../types';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const PAYMENT_MODES: { id: PaymentMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'upi', label: 'UPI / QR', icon: <Smartphone className="w-4 h-4" />, desc: 'PhonePe, GPay, Paytm' },
  { id: 'card', label: 'Debit / Credit Card', icon: <CreditCard className="w-4 h-4" />, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: <Building2 className="w-4 h-4" />, desc: 'All Indian major banks' },
  { id: 'recurring', label: 'Monthly AutoPay', icon: <RefreshCcw className="w-4 h-4" />, desc: 'Recurring e-mandate' },
];

interface DonationDrawerProps {
  open: boolean;
  onClose: () => void;
  requirement: Requirement | null;
}

export function DonationDrawer({ open, onClose, requirement: req }: DonationDrawerProps) {
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('upi');
  const [showUSD, setShowUSD] = useState(false);
  const [requires80G, setRequires80G] = useState(false);
  const [pan, setPan] = useState('');
  const [address, setAddress] = useState('');
  const [addTip, setAddTip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details');

  const effectiveAmount = customAmount ? parseInt(customAmount) || 0 : amount;
  const platformFee = addTip ? 0 : Math.round(effectiveAmount * 0.02);
  const tipAmount = addTip ? Math.round(effectiveAmount * 0.02) : 0;
  const total = effectiveAmount + (addTip ? tipAmount : platformFee);

  const handleDonate = async () => {
    if (!effectiveAmount || effectiveAmount < 10) {
      toast.error('Minimum contribution amount is ₹10');
      return;
    }
    if (requires80G && !pan) {
      toast.error('PAN number is required for Section 80G tax receipt');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    setStep('success');
    setTimeout(() => {
      toast.success('Donation confirmed! 80G receipt issued.', { duration: 5000 });
    }, 300);
  };

  const handleClose = () => {
    setStep('details');
    setAmount(1000);
    setCustomAmount('');
    setRequires80G(false);
    setPan('');
    onClose();
  };

  if (!req) return null;

  return (
    <Modal open={open} onClose={handleClose} size="lg">
      <AnimatePresence mode="wait">
        {step === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center p-8 bg-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mb-5"
            >
              <Check className="w-10 h-10 text-emerald-700" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">Contribution Confirmed! 🙏</h2>
            <p className="text-slate-600 mb-2 text-base">Your contribution of <span className="text-emerald-700 font-extrabold">{formatINR(effectiveAmount)}</span> is registered.</p>
            <p className="text-xs text-slate-500 mb-6 font-medium">Purchase order placed with partner grocer. Delivery expected within 24–48 hours.</p>
            {requires80G && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6 text-xs text-sky-900 font-semibold w-full max-w-sm">
                📄 Section 80G Tax Receipt emailed to your registered address.
              </div>
            )}
            <div className="flex gap-3 w-full max-w-xs">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Done</Button>
              <Button className="flex-1">Track Delivery</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white">
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-lg font-bold text-slate-900 font-heading">Fulfill Need Request</h2>
                <button onClick={handleClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-semibold text-slate-700">{req.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant={req.priority === 'urgent' ? 'urgent' : 'recurring'} dot>{req.priority} Priority</Badge>
                <span className="text-xs text-slate-500 font-medium">{req.orphanageName}, {req.orphanageCity}</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-800">Choose Contribution Amount</label>
                  <button onClick={() => setShowUSD(!showUSD)} className="text-xs text-emerald-700 hover:underline font-bold">
                    {showUSD ? 'Show ₹ INR' : `≈ ${toUSD(effectiveAmount)} USD`}
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {PRESET_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setAmount(a); setCustomAmount(''); }}
                      className={cn(
                        'text-sm font-bold py-2.5 rounded-xl border transition-all duration-150',
                        amount === a && !customAmount
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700'
                      )}
                    >
                      ₹{a >= 1000 ? `${a / 1000}K` : a}
                    </button>
                  ))}
                </div>
                <Input
                  prefix="₹"
                  placeholder="Or enter custom amount"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                  type="number"
                  min="10"
                />
                {showUSD && effectiveAmount > 0 && (
                  <p className="text-xs text-slate-500 mt-1 font-medium">≈ {toUSD(effectiveAmount)} USD (FX rate: 1 USD = ₹83.5)</p>
                )}
              </div>

              {/* Payment Mode */}
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-2.5">Payment Method</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {PAYMENT_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setPaymentMode(mode.id)}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150',
                        paymentMode === mode.id
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <div className={cn('mt-0.5', paymentMode === mode.id ? 'text-emerald-700' : 'text-slate-500')}>{mode.icon}</div>
                      <div>
                        <div className={cn('text-xs font-bold', paymentMode === mode.id ? 'text-emerald-950' : 'text-slate-800')}>{mode.label}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{mode.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 80G Tax */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => setRequires80G(!requires80G)}
                    className={cn('w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0', requires80G ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-white')}
                  >
                    {requires80G && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900">Request Section 80G Tax Receipt</span>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Claim 50% tax exemption under Indian Income Tax Act</p>
                  </div>
                </label>
                <AnimatePresence>
                  {requires80G && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3.5 space-y-3 pt-3 border-t border-slate-200/80"
                    >
                      <Input label="PAN Card Number" placeholder="ABCDE1234F" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} maxLength={10} />
                      <Input label="Postal Address (for receipt)" placeholder="Full address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tip toggle */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="text-sm font-bold text-slate-800">2% Platform Operational Cost</span>
                      <p className="text-xs text-slate-500 font-medium">Add optional tip so 100% of donation goes to children</p>
                    </div>
                  </div>
                  <div
                    onClick={() => setAddTip(!addTip)}
                    className={cn('w-10 h-5 rounded-full transition-all duration-300 cursor-pointer relative flex-shrink-0', addTip ? 'bg-emerald-600' : 'bg-slate-300')}
                  >
                    <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300', addTip ? 'left-5' : 'left-0.5')} />
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 bg-slate-100/70 rounded-xl p-4 border border-slate-200/80">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Fulfillment Amount</span>
                  <span className="text-slate-900 font-bold">{formatINR(effectiveAmount)}</span>
                </div>
                {addTip ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-700 font-medium">Platform Tip (100% direct fulfillment)</span>
                    <span className="text-emerald-700 font-bold">+{formatINR(tipAmount)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Processing Fee (2%)</span>
                    <span className="text-slate-700 font-medium">{formatINR(platformFee)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between">
                  <span className="text-slate-900 font-bold">Total Payment</span>
                  <span className="text-slate-900 font-extrabold text-lg">{formatINR(total)}</span>
                </div>
              </div>

              <Button
                onClick={handleDonate}
                loading={loading}
                className="w-full font-bold"
                size="lg"
                disabled={effectiveAmount < 10}
              >
                {loading ? 'Processing...' : `Confirm & Fulfill ${formatINR(effectiveAmount)}`}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit Encrypted · Direct Vendor Settlement</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
