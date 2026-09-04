import { motion } from 'framer-motion';
import type { PlatformStats } from '../../types';
import { formatINRCompact } from '../../lib/utils';

interface StatsTickerProps {
  stats: PlatformStats;
}

export function StatsTicker({ stats }: StatsTickerProps) {
  const items = [
    { value: formatINRCompact(stats.totalRaised), label: 'Total Funds Raised', color: 'text-emerald-700', bg: 'bg-emerald-50/80 border-emerald-200' },
    { value: stats.verifiedShelters.toString(), label: 'Verified Shelters', color: 'text-sky-700', bg: 'bg-sky-50/80 border-sky-200' },
    { value: `${stats.childrenSupported.toLocaleString('en-IN')}+`, label: 'Children Supported', color: 'text-purple-700', bg: 'bg-purple-50/80 border-purple-200' },
    { value: `${stats.donationsCount.toLocaleString('en-IN')}+`, label: 'Fulfillments Completed', color: 'text-amber-700', bg: 'bg-amber-50/80 border-amber-200' },
    { value: `${stats.successRate}%`, label: 'Verified Success Rate', color: 'text-rose-700', bg: 'bg-rose-50/80 border-rose-200' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.08 }}
          className={`border rounded-2xl px-4 py-3.5 text-center bg-white shadow-2xs ${item.bg}`}
        >
          <div className={`text-2xl font-extrabold ${item.color} mb-0.5 font-heading`}>{item.value}</div>
          <div className="text-xs text-slate-600 font-semibold">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
