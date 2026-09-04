import { Download, FileSpreadsheet, BarChart3 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '../ui';
import { mockDonations } from '../../data/mockData';
import { formatINR, formatDate } from '../../lib/utils';
import { toast } from 'sonner';

export function AuditLogs() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 font-heading">CSR Audit & Compliance Logs</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success('CSV Audit Log Exported!')} className="gap-1.5 font-bold">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success('Compliance PDF Report Generated!')} className="gap-1.5 font-bold">
            <Download className="w-4 h-4 text-sky-700" />CSR PDF Report
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Disbursed', value: formatINR(mockDonations.reduce((s, d) => s + d.amount, 0)), color: 'text-emerald-700' },
          { label: 'Verified Transactions', value: mockDonations.length.toString(), color: 'text-sky-700' },
          { label: 'Avg Fulfillment', value: formatINR(Math.round(mockDonations.reduce((s, d) => s + d.amount, 0) / mockDonations.length)), color: 'text-purple-700' },
          { label: '80G Certificates Issued', value: mockDonations.filter(d => d.requires80G).length.toString(), color: 'text-amber-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-3.5 text-center shadow-2xs">
            <div className={`text-xl font-extrabold font-heading ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 font-bold mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Transaction log */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 font-heading">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            Audit Ledger Transactions
          </h4>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-3 px-4 font-bold">Transaction Ref</th>
                <th className="text-left py-3 px-3 font-bold">Donor</th>
                <th className="text-left py-3 px-3 font-bold">Target Shelter</th>
                <th className="text-left py-3 px-3 font-bold">Amount</th>
                <th className="text-left py-3 px-3 font-bold">Section 80G</th>
                <th className="text-left py-3 pr-4 font-bold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockDonations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-700 font-semibold">#{d.transactionId}</td>
                  <td className="py-3 px-3 text-slate-800 text-xs font-semibold">{d.donorName}</td>
                  <td className="py-3 px-3 text-slate-600 text-xs font-medium">{d.orphanageName}</td>
                  <td className="py-3 px-3 font-extrabold text-slate-900">{formatINR(d.amount)}</td>
                  <td className="py-3 px-3">
                    {d.requires80G ? <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ Issued</span> : <span className="text-xs text-slate-400">—</span>}
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-500 font-medium">{formatDate(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
