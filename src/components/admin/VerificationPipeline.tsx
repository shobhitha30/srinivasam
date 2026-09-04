import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, CheckCircle2, XCircle, Clock, ChevronDown, Building2 } from 'lucide-react';
import { Badge, Button, Tabs } from '../ui';
import { mockOrphanages, mockVerificationRecords } from '../../data/mockData';
import type { VerificationStage } from '../../types';
import { toast } from 'sonner';

const STAGE_CONFIG: Record<VerificationStage, { label: string; color: string }> = {
  application_received: { label: 'Application Received', color: 'text-slate-600' },
  documents_review: { label: 'Documents Review', color: 'text-sky-700' },
  verification_call: { label: 'Verification Call Scheduled', color: 'text-amber-700' },
  headcount_audit: { label: 'Headcount Audit', color: 'text-purple-700' },
  approved: { label: 'Verified & Approved', color: 'text-emerald-700' },
  rejected: { label: 'Rejected', color: 'text-rose-700' },
};

export function VerificationPipeline() {
  const [activeTab, setActiveTab] = useState('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingShelters = mockOrphanages.filter((o) => o.status === 'pending');
  const verifiedShelters = mockOrphanages.filter((o) => o.status === 'verified');

  const tabs = [
    { id: 'pending', label: 'Pending Verification Queue', count: pendingShelters.length, icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'verified', label: 'Verified Orphanages', count: verifiedShelters.length, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  const items = activeTab === 'pending' ? pendingShelters : verifiedShelters;

  return (
    <div className="space-y-4">
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="space-y-3">
        {items.map((shelter, i) => {
          const record = mockVerificationRecords.find((r) => r.orphanageId === shelter.id);
          const isExpanded = expandedId === shelter.id;

          return (
            <motion.div
              key={shelter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs"
            >
              <div
                className="flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : shelter.id)}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-xs">
                  {shelter.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 text-base font-heading">{shelter.name}</div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">{shelter.city}, {shelter.state} · {shelter.childrenCount} resident children · Reg #{shelter.registrationNumber}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={shelter.status === 'verified' ? 'verified' : shelter.status === 'pending' ? 'pending' : 'error'}>
                        {shelter.status.toUpperCase()}
                      </Badge>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {record && (
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      <span className={`text-xs font-bold ${STAGE_CONFIG[record.stage].color}`}>
                        Current Stage: {STAGE_CONFIG[record.stage].label}
                      </span>
                      {record.assignedTo && <span className="text-xs text-slate-500 font-medium">· Assigned Auditor: {record.assignedTo}</span>}
                    </div>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 px-4 pb-4 bg-slate-50/50">
                  <div className="pt-4 space-y-4">
                    {/* KYC status */}
                    <div>
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Compliance Document Audit</div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {shelter.kycDocuments.map((doc) => (
                          <div key={doc.id} className={`text-center p-2.5 rounded-xl border text-xs font-bold ${
                            doc.status === 'verified' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                            doc.status === 'uploaded' ? 'bg-sky-50 border-sky-200 text-sky-900' :
                            doc.status === 'expired' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                            'bg-slate-100 border-slate-200 text-slate-500'
                          }`}>
                            <div>{doc.label}</div>
                            <div className="text-[10px] mt-0.5 uppercase opacity-80">{doc.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {record?.notes && (
                      <div className="bg-white rounded-xl p-3.5 border border-slate-200">
                        <div className="text-xs font-bold text-slate-700 mb-1">Auditor Review Notes</div>
                        <p className="text-sm text-slate-700 font-medium">{record.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {shelter.status === 'pending' && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button size="sm" variant="outline" className="gap-1.5 font-bold">
                          <Phone className="w-3.5 h-3.5 text-sky-600" />Schedule Verification Call
                        </Button>
                        <Button size="sm" variant="success" onClick={() => toast.success(`${shelter.name} verified & approved!`)} className="gap-1.5 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />Approve Shelter
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => toast.error(`${shelter.name} application rejected.`)} className="gap-1.5 font-bold">
                          <XCircle className="w-3.5 h-3.5" />Reject Application
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
