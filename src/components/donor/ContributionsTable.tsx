import { motion } from 'framer-motion';
import { Download, CheckCircle2, Package, Truck, MapPin } from 'lucide-react';
import { Badge, Button, Card, Skeleton } from '../ui';
import { useDonations } from '../../hooks/useDonations';
import { formatDate, formatINR } from '../../lib/utils';
import type { DeliveryStatus, Donation } from '../../types';
import { toast } from 'sonner';

const STATUS_STEPS: { key: DeliveryStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'payment_confirmed', label: 'Payment Confirmed', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { key: 'order_placed', label: 'Order Placed with Vendor', icon: <Package className="w-3.5 h-3.5" /> },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck className="w-3.5 h-3.5" /> },
  { key: 'delivered_verified', label: 'Delivered & Verified', icon: <MapPin className="w-3.5 h-3.5" /> },
];

const STATUS_ORDER: DeliveryStatus[] = ['payment_confirmed', 'order_placed', 'out_for_delivery', 'delivered_verified'];

function DeliveryStatusPill({ status }: { status: DeliveryStatus }) {
  const config: Record<DeliveryStatus, { label: string; variant: 'info' | 'warning' | 'pending' | 'success' }> = {
    payment_confirmed: { label: 'Payment Confirmed', variant: 'info' },
    order_placed: { label: 'Order Placed', variant: 'warning' },
    out_for_delivery: { label: 'Out for Delivery', variant: 'pending' },
    delivered_verified: { label: '✓ Delivered & Verified', variant: 'success' },
  };
  return <Badge variant={config[status].variant} dot={status !== 'delivered_verified'}>{config[status].label}</Badge>;
}

function DonationRow({ donation }: { donation: Donation }) {
  const stepIdx = STATUS_ORDER.indexOf(donation.deliveryStatus);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-2xs hover:border-slate-300 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div>
          <div className="font-bold text-slate-900 text-base font-heading">{donation.requirementTitle}</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">{donation.orphanageName} · Contributed on {formatDate(donation.createdAt)}</div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl font-extrabold text-slate-900 font-heading">{formatINR(donation.amount)}</span>
          {donation.receiptUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success('Section 80G Tax Receipt PDF downloaded!')}
              className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1.5 font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>80G Receipt</span>
            </Button>
          )}
        </div>
      </div>

      {/* Status timeline */}
      <div className="flex items-center gap-0 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        {STATUS_STEPS.map((s, i) => {
          const done = i <= stepIdx;
          const active = i === stepIdx;
          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-1.5 rounded-full text-[11px] font-bold px-2.5 py-1 transition-all ${
                done ? (active ? 'bg-sky-100 text-sky-800 border border-sky-300' : 'bg-emerald-100 text-emerald-800') : 'text-slate-400'
              }`}>
                {s.icon}
                <span className="hidden md:block">{s.label}</span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1.5 transition-all duration-500 ${i < stepIdx ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <DeliveryStatusPill status={donation.deliveryStatus} />
        <span className="text-xs text-slate-500 font-medium capitalize">{donation.paymentMode.replace('_', ' ')} · Ref #{donation.transactionId.slice(-6)}</span>
        {donation.requires80G && <Badge variant="info">Section 80G Eligible</Badge>}
      </div>
    </motion.div>
  );
}

export function ContributionsTable() {
  const { donations, totalDonated, completedCount, isLoading } = useDonations('u1');

  if (isLoading) return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">My Impact & Contributions</h3>
          <p className="text-sm text-slate-600 font-medium">{donations.length} total contributions · {formatINR(totalDonated)} disbursed · {completedCount} verified deliveries</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success('Contribution CSV report exported!')}>
          <Download className="w-3.5 h-3.5" />
          Export CSV Summary
        </Button>
      </div>
      {donations.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl text-slate-500 font-medium">No contributions made yet.</div>
      ) : (
        <div className="space-y-3">
          {donations.map((d) => <DonationRow key={d.id} donation={d} />)}
        </div>
      )}
    </div>
  );
}
