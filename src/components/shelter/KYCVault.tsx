import { Upload, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui';
import type { KYCDocument } from '../../types';
import { formatDate } from '../../lib/utils';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface KYCVaultProps {
  documents: KYCDocument[];
}

const STATUS_CONFIG = {
  verified: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200', label: 'Verified & Active' },
  uploaded: { icon: <Clock className="w-4 h-4" />, color: 'text-sky-800', bg: 'bg-sky-50 border-sky-200', label: 'Under Admin Review' },
  pending: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200', label: 'Pending Upload' },
  expired: { icon: <XCircle className="w-4 h-4" />, color: 'text-rose-800', bg: 'bg-rose-50 border-rose-200', label: 'Expired' },
};

export function KYCVault({ documents }: KYCVaultProps) {
  const verified = documents.filter((d) => d.status === 'verified').length;
  const total = documents.length;
  const percent = Math.round((verified / total) * 100);

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">KYC & Regulatory Compliance Vault</h3>
            <p className="text-sm text-slate-600 font-medium mt-1">{verified} of {total} required NGO documents verified by admin</p>
          </div>
          <div className="text-right">
            <div className={cn('text-2xl font-extrabold font-heading', percent === 100 ? 'text-emerald-700' : percent >= 60 ? 'text-sky-700' : 'text-amber-700')}>{percent}%</div>
            <div className="text-xs text-slate-500 font-bold uppercase">Compliance Score</div>
          </div>
        </div>
        {/* Progress */}
        <div className="mt-3 w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', percent === 100 ? 'bg-emerald-600' : percent >= 60 ? 'bg-sky-600' : 'bg-amber-500')}
            style={{ width: `${percent}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        {documents.map((doc) => {
          const config = STATUS_CONFIG[doc.status];
          return (
            <div key={doc.id} className={cn('flex items-center justify-between p-4 rounded-xl border shadow-2xs', config.bg)}>
              <div className="flex items-center gap-3">
                <div className={config.color}>{config.icon}</div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{doc.label}</div>
                  <div className="text-xs text-slate-600 font-medium">
                    {doc.verifiedAt ? `Verified on ${formatDate(doc.verifiedAt)}` :
                     doc.uploadedAt ? `Uploaded on ${formatDate(doc.uploadedAt)}` :
                     'Document required'}
                    {doc.expiryDate && <span className={cn('ml-2 font-bold', new Date(doc.expiryDate) < new Date() ? 'text-rose-700' : 'text-slate-500')}>· Expiry: {formatDate(doc.expiryDate)}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 border border-slate-200', config.color)}>{config.label}</span>
                {(doc.status === 'pending' || doc.status === 'expired') && (
                  <label className="cursor-pointer text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    Upload PDF
                    <input type="file" className="hidden" onChange={() => toast.success(`${doc.label} uploaded for admin review!`)} />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
