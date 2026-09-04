import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Award, RefreshCcw, Plus } from 'lucide-react';
import { StatCard, Tabs, Button } from '../components/ui';
import { ContributionsTable } from '../components/donor/ContributionsTable';
import { ImpactGallery } from '../components/donor/ImpactGallery';
import { DonationDrawer } from '../components/donor/DonationDrawer';
import { useDonations } from '../hooks/useDonations';
import { formatINR } from '../lib/utils';
import { mockRequirements } from '../data/mockData';

const tabs = [
  { id: 'contributions', label: 'My Contributions', icon: <Heart className="w-3.5 h-3.5" /> },
  { id: 'gallery', label: 'Impact Gallery', icon: <Award className="w-3.5 h-3.5" /> },
  { id: 'recurring', label: 'Recurring Care', icon: <RefreshCcw className="w-3.5 h-3.5" /> },
];

export function DonorPage() {
  const [activeTab, setActiveTab] = useState('contributions');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { donations, totalDonated, completedCount, isLoading } = useDonations('u1');

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-xs text-emerald-700 font-bold tracking-wider uppercase">Donor Portal</span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">Welcome back, Arjun 👋</h1>
              <p className="text-slate-600 mt-1 text-sm font-medium">Your kindness has supported {completedCount} verified deliveries this year.</p>
            </motion.div>
          </div>
          <Button onClick={() => setDrawerOpen(true)} size="lg" className="gap-2 flex-shrink-0 font-bold">
            <Plus className="w-4 h-4" />Make a Contribution
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Disbursed" value={formatINR(totalDonated)} icon={<Heart className="w-5 h-5" />} color="emerald" loading={isLoading} trend="+₹3.5K this month" />
          <StatCard label="Total Contributions" value={donations.length} icon={<TrendingUp className="w-5 h-5" />} color="sky" loading={isLoading} />
          <StatCard label="Verified Deliveries" value={completedCount} icon={<Award className="w-5 h-5" />} color="purple" loading={isLoading} />
          <StatCard label="Active Monthly Care" value="1 shelter" icon={<RefreshCcw className="w-5 h-5" />} color="amber" loading={isLoading} />
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} className="mb-6 bg-white border border-slate-200" />

        {activeTab === 'contributions' && <ContributionsTable />}
        {activeTab === 'gallery' && <ImpactGallery />}
        {activeTab === 'recurring' && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-600 font-medium">
            <RefreshCcw className="w-10 h-10 mx-auto mb-3 text-amber-600 opacity-80" />
            <p className="text-slate-900 font-bold text-lg">Active Monthly Care Mandate</p>
            <p className="text-sm text-slate-500 mt-1">Asha Kiran Sadan · Next automated dispatch: October 15, 2026 (₹8,300)</p>
          </div>
        )}

        <DonationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} requirement={mockRequirements[0]} />
      </div>
    </div>
  );
}
