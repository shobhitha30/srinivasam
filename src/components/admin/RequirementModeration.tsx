import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Check, X, Edit3 } from 'lucide-react';
import { Badge, Button, ProgressBar } from '../ui';
import { mockRequirements } from '../../data/mockData';
import { formatINR, formatDate, fundingPercent } from '../../lib/utils';
import { toast } from 'sonner';

export function RequirementModeration() {
  const [requirements, setRequirements] = useState(mockRequirements.filter((r) => r.status !== 'delivered'));

  const handleApprove = (id: string) => {
    setRequirements((prev) => prev.map((r) => r.id === id ? { ...r, status: 'active' as const } : r));
    toast.success('Requirement approved and live on public feed!');
  };

  const handleReject = (id: string) => {
    setRequirements((prev) => prev.filter((r) => r.id !== id));
    toast.error('Requirement rejected.');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 font-heading">Campaign Moderation Queue</h3>
        <span className="text-sm font-semibold text-slate-500">{requirements.length} active campaigns</span>
      </div>
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50/80">
              <th className="text-left py-3.5 px-4 font-bold">Requirement Title</th>
              <th className="text-left py-3.5 px-3 font-bold">Shelter</th>
              <th className="text-left py-3.5 px-3 font-bold w-32">Funding Target</th>
              <th className="text-left py-3.5 px-3 font-bold w-36">Progress</th>
              <th className="text-left py-3.5 px-3 font-bold w-28">Status</th>
              <th className="text-right py-3.5 pr-4 font-bold w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requirements.map((req, i) => (
              <motion.tr
                key={req.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="group hover:bg-slate-50 transition-colors"
              >
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 leading-snug">{req.title}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{req.category} · Created {formatDate(req.createdAt)}</div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="text-slate-800 text-xs font-bold">{req.orphanageName}</div>
                  <div className="text-slate-500 text-xs font-medium">{req.orphanageCity}</div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-900">{formatINR(req.totalAmount)}</div>
                  <div className="text-xs text-emerald-700 font-bold">{formatINR(req.fundedAmount)} raised</div>
                </td>
                <td className="py-3.5 px-3">
                  <ProgressBar value={fundingPercent(req.fundedAmount, req.totalAmount)} size="sm" />
                  <div className="text-xs text-slate-500 font-bold mt-1">{fundingPercent(req.fundedAmount, req.totalAmount)}%</div>
                </td>
                <td className="py-3.5 px-3">
                  <Badge variant={
                    req.status === 'fully_funded' ? 'success' :
                    req.status === 'partially_funded' ? 'info' :
                    req.status === 'active' ? 'verified' : 'pending'
                  }>
                    {req.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-all" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all" title="Edit Need">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {req.status !== 'active' && req.status !== 'fully_funded' && (
                      <button onClick={() => handleApprove(req.id)} className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all" title="Approve">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleReject(req.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Reject">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
