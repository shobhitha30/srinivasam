import { motion } from 'framer-motion';
import { ExternalLink, Package, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Badge } from '../ui';
import { mockVendorOrders } from '../../data/mockData';
import { formatDate, formatINR } from '../../lib/utils';
import type { DispatchStatus, VendorType } from '../../types';

const VENDOR_LOGOS: Record<VendorType, { name: string; color: string; emoji: string }> = {
  blinkit: { name: 'Blinkit Quick-Commerce', color: 'text-amber-800', emoji: '🟡' },
  zepto: { name: 'Zepto Express', color: 'text-purple-800', emoji: '🟣' },
  amazon: { name: 'Amazon Business', color: 'text-amber-900', emoji: '📦' },
  local_grocer: { name: 'Verified Local Grocer', color: 'text-emerald-800', emoji: '🏪' },
  pharma: { name: 'PharmEasy Medical', color: 'text-sky-800', emoji: '💊' },
};

const STATUS_CONFIG: Record<DispatchStatus, { icon: React.ReactNode; variant: 'pending' | 'info' | 'warning' | 'success' | 'error'; label: string }> = {
  pending: { icon: <Clock className="w-3.5 h-3.5" />, variant: 'pending', label: 'Pending Dispatch' },
  confirmed: { icon: <Package className="w-3.5 h-3.5" />, variant: 'info', label: 'Order Confirmed' },
  dispatched: { icon: <Truck className="w-3.5 h-3.5" />, variant: 'warning', label: 'Out for Delivery' },
  delivered: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, variant: 'success', label: 'Delivered & Verified' },
  failed: { icon: <XCircle className="w-3.5 h-3.5" />, variant: 'error', label: 'Dispatch Failed' },
};

export function VendorDispatchMonitor() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 font-heading">Vendor Purchase Orders & Dispatch Monitor</h3>
        <span className="text-sm font-semibold text-slate-500">{mockVendorOrders.length} active dispatches</span>
      </div>

      <div className="space-y-3">
        {mockVendorOrders.map((order, i) => {
          const vendor = VENDOR_LOGOS[order.vendorType];
          const status = STATUS_CONFIG[order.status];

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 bg-slate-50 border border-slate-200 rounded-xl">{vendor.emoji}</div>
                  <div>
                    <div className="font-bold text-slate-900 text-base font-heading">{order.orphanageName}</div>
                    <div className={`text-xs font-bold ${vendor.color}`}>{vendor.name} · Order #{order.vendorOrderId.split('-').pop()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={status.variant} dot={order.status === 'dispatched'}>
                    <span className="flex items-center gap-1 font-bold">{status.icon}{status.label}</span>
                  </Badge>
                  {order.trackingUrl && (
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-700 transition-colors p-1 rounded-lg hover:bg-slate-100" title="Track Live">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
                  <div className="text-slate-500 font-medium mb-0.5">Order Value</div>
                  <div className="font-extrabold text-slate-900 text-sm">{formatINR(order.totalAmount)}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
                  <div className="text-slate-500 font-medium mb-0.5">Line Items</div>
                  <div className="font-bold text-slate-800 text-sm">{order.items.length} essential items</div>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
                  <div className="text-slate-500 font-medium mb-0.5">Expected Delivery</div>
                  <div className="font-bold text-slate-800 text-sm">{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'TBD'}</div>
                </div>
              </div>

              {/* Items preview */}
              <div className="flex flex-wrap gap-1.5">
                {order.items.slice(0, 3).map((item) => (
                  <span key={item.id} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {item.name} ×{item.quantity}
                  </span>
                ))}
                {order.items.length > 3 && (
                  <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5">+{order.items.length - 3} more items</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
