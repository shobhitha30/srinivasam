import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Package, BarChart3, CheckSquare, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { StatCard, Tabs } from '../components/ui';
import { VerificationPipeline } from '../components/admin/VerificationPipeline';
import { RequirementModeration } from '../components/admin/RequirementModeration';
import { VendorDispatchMonitor } from '../components/admin/VendorDispatchMonitor';
import { AuditLogs } from '../components/admin/AuditLogs';
import { mockOrphanages, mockRequirements, mockVendorOrders, mockDonations } from '../data/mockData';
import { formatINR } from '../lib/utils';

const tabs = [
  { id: 'verifications', label: 'Verifications Queue', icon: <ShieldCheck className="w-3.5 h-3.5" />, count: 1 },
  { id: 'moderation', label: 'Campaign Moderation', icon: <CheckSquare className="w-3.5 h-3.5" />, count: mockRequirements.filter(r => r.status !== 'delivered').length },
  { id: 'dispatch', label: 'Dispatch Monitor', icon: <Package className="w-3.5 h-3.5" /> },
  { id: 'audit', label: 'Audit Ledger', icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('verifications');
  const totalDisbursed = mockDonations.reduce((s, d) => s + d.amount, 0);
  const pendingCount = mockOrphanages.filter(o => o.status === 'pending').length;
  const activeDispatch = mockVendorOrders.filter(v => v.status !== 'delivered').length;

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs text-slate-600 font-bold tracking-wider uppercase">Governance & Verification Console</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">Admin Governance Hub</h1>
          <p className="text-slate-600 mt-1 text-sm font-medium">NGO audit queue, shelter verification pipelines, vendor dispatch tracking, and financial ledgers.</p>
        </div>

        {/* Alert for pending */}
        {pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4 shadow-2xs"
          >
            <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <span className="text-sm text-amber-900 font-semibold">
              <strong>{pendingCount} new shelter application(s)</strong> awaiting document inspection and verification audit.
            </span>
            <button onClick={() => setActiveTab('verifications')} className="text-xs font-bold text-amber-800 underline ml-auto hover:text-amber-950">Review Application →</button>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Disbursed Funds" value={formatINR(totalDisbursed)} icon={<TrendingUp className="w-5 h-5" />} color="emerald" trend="+₹19K this month" />
          <StatCard label="Verified Shelter Partners" value={mockOrphanages.filter(o => o.status === 'verified').length} icon={<ShieldCheck className="w-5 h-5" />} color="sky" />
          <StatCard label="Active Vendor Dispatches" value={activeDispatch} icon={<Package className="w-5 h-5" />} color="amber" />
          <StatCard label="Pending Verification Reviews" value={pendingCount} icon={<Users className="w-5 h-5" />} color="purple" />
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto pb-2 mb-6">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} className="bg-white border border-slate-200" />
        </div>

        {activeTab === 'verifications' && <VerificationPipeline />}
        {activeTab === 'moderation' && <RequirementModeration />}
        {activeTab === 'dispatch' && <VendorDispatchMonitor />}
        {activeTab === 'audit' && <AuditLogs />}
      </div>
    </div>
  );
}
