import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, Upload, Shield, Plus, IndianRupee, Users, Package, CheckCircle2 } from 'lucide-react';
import { StatCard, Tabs, Button } from '../components/ui';
import { CreateRequirementWizard } from '../components/shelter/CreateRequirementWizard';
import { DeliveryProofUploader } from '../components/shelter/DeliveryProofUploader';
import { KYCVault } from '../components/shelter/KYCVault';
import { NeedCard } from '../components/public/NeedCard';
import { mockOrphanages, mockRequirements } from '../data/mockData';
import { formatINR } from '../lib/utils';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <Home className="w-3.5 h-3.5" /> },
  { id: 'requests', label: 'My Requests', icon: <FileText className="w-3.5 h-3.5" />, count: 3 },
  { id: 'proofs', label: 'Delivery Proofs', icon: <Upload className="w-3.5 h-3.5" /> },
  { id: 'kyc', label: 'KYC Vault', icon: <Shield className="w-3.5 h-3.5" /> },
];

export function ShelterPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [wizardOpen, setWizardOpen] = useState(false);
  const shelter = mockOrphanages[0]; // Bal Seva Ashram
  const myRequirements = mockRequirements.filter((r) => r.orphanageId === shelter.id);
  const monthlyFunding = myRequirements.reduce((s, r) => s + r.fundedAmount, 0);

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs text-emerald-700 font-bold tracking-wider uppercase">Shelter Management Hub</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">{shelter.name}</h1>
            <p className="text-slate-600 mt-1 text-sm font-medium">{shelter.city}, {shelter.state} · {shelter.childrenCount} resident children · {shelter.staffCount} staff members</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-100/80 border border-emerald-300 rounded-full px-3 py-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900">Verified Shelter Partner</span>
            </div>
          </div>
          <Button onClick={() => setWizardOpen(true)} size="lg" variant="success" className="gap-2 flex-shrink-0 font-bold">
            <Plus className="w-4 h-4" />Submit Need Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Requests" value={shelter.activeRequirementsCount} icon={<FileText className="w-5 h-5" />} color="emerald" />
          <StatCard label="Funding Received This Month" value={formatINR(monthlyFunding)} icon={<IndianRupee className="w-5 h-5" />} color="sky" trend="+₹8.5K" />
          <StatCard label="Resident Children Supported" value={shelter.childrenCount} icon={<Users className="w-5 h-5" />} color="purple" />
          <StatCard label="Total Disbursed Funds" value={formatINR(shelter.totalFundingReceived)} icon={<Package className="w-5 h-5" />} color="amber" />
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto pb-2 mb-6">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} className="bg-white border border-slate-200" />
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="font-bold text-slate-900 text-base mb-3 font-heading">Upcoming Vendor Dispatches</h3>
                <div className="space-y-2">
                  {myRequirements.filter(r => r.status !== 'delivered').map(r => (
                    <div key={r.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-800 font-semibold">{r.title.split('—')[0]}</span>
                      <span className="text-xs text-emerald-700 font-extrabold">{formatINR(r.fundedAmount)} / {formatINR(r.totalAmount)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="font-bold text-slate-900 text-base mb-3 font-heading">KYC & Document Status</h3>
                <div className="space-y-2">
                  {shelter.kycDocuments.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-700 font-medium">{doc.label}</span>
                      <span className={`text-xs font-bold ${doc.status === 'verified' ? 'text-emerald-700' : doc.status === 'expired' ? 'text-rose-700' : doc.status === 'uploaded' ? 'text-sky-700' : 'text-amber-700'}`}>
                        {doc.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myRequirements.map((req) => (
              <NeedCard key={req.id} requirement={req} onDonate={() => {}} />
            ))}
          </div>
        )}

        {activeTab === 'proofs' && <DeliveryProofUploader />}
        {activeTab === 'kyc' && <KYCVault documents={shelter.kycDocuments} />}

        <CreateRequirementWizard open={wizardOpen} onClose={() => setWizardOpen(false)} childrenCount={shelter.childrenCount} />
      </div>
    </div>
  );
}
