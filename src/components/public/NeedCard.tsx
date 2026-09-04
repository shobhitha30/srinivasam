import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ChevronRight, Share2, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Badge, Button, Card, CardHeader, CardContent, CardFooter, ProgressBar, Skeleton } from '../ui';
import { formatINR, formatINRCompact, fundingPercent, daysUntil } from '../../lib/utils';
import type { Requirement } from '../../types';
import { toast } from 'sonner';

interface NeedCardProps {
  requirement: Requirement;
  onDonate: (req: Requirement) => void;
}

export function NeedCard({ requirement: req, onDonate }: NeedCardProps) {
  const [expanded, setExpanded] = useState(false);
  const percent = fundingPercent(req.fundedAmount, req.totalAmount);
  const days = req.deadline ? daysUntil(req.deadline) : null;

  const priorityVariant = req.priority === 'urgent' ? 'urgent' : req.priority === 'recurring' ? 'recurring' : 'standard';
  const statusColor = req.status === 'fully_funded' ? 'emerald' : req.status === 'partially_funded' ? 'sky' : 'amber';

  const handleShare = () => {
    navigator.clipboard.writeText(`https://srinivasam.inc/need/${req.id}`);
    toast.success('Campaign link copied!');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className="group"
    >
      <Card className="border-slate-200/80 hover:border-emerald-300 transition-all duration-200 hover:shadow-md overflow-hidden bg-white">
        {/* Top Priority Bar */}
        <div className={`h-1.5 w-full ${
          req.priority === 'urgent' ? 'bg-rose-500' :
          req.priority === 'recurring' ? 'bg-amber-500' :
          'bg-emerald-600'
        }`} />

        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant={priorityVariant} dot={req.priority === 'urgent'}>
                {req.priority.charAt(0).toUpperCase() + req.priority.slice(1)} Need
              </Badge>
              <Badge variant="info">{req.category}</Badge>
              {req.status === 'fully_funded' && <Badge variant="success">✓ Fully Funded</Badge>}
            </div>
            <button
              onClick={handleShare}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100 flex-shrink-0"
              title="Share Campaign"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 group-hover:text-emerald-700 transition-colors font-heading">
            {req.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {req.orphanageName}, <strong className="text-slate-700">{req.orphanageCity}</strong>
            </span>
            {days !== null && (
              <span className={`flex items-center gap-1 font-semibold ${days <= 3 ? 'text-rose-600' : 'text-slate-500'}`}>
                <Clock className="w-3.5 h-3.5" />
                {days <= 0 ? 'Urgent' : `${days}d left`}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-4">
          {/* Progress */}
          <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Raised so far</span>
                <span className="font-extrabold text-slate-900 text-base">{formatINR(req.fundedAmount)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-medium">Goal</span>
                <span className="font-semibold text-slate-700">{formatINR(req.totalAmount)}</span>
              </div>
            </div>
            <ProgressBar value={percent} color={statusColor as any} size="md" />
            <div className="flex justify-between items-center text-xs text-slate-500 mt-1.5 font-medium">
              <span>{percent}% funded</span>
              <span>{req.items.length} itemised essentials</span>
            </div>
          </div>

          {/* Items preview */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Itemised Breakdown</div>
                  {req.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50 last:border-0">
                      <span className="text-slate-800 font-medium">{item.name}</span>
                      <span className="text-slate-500">{item.quantity} {item.unit} × {formatINR(item.unitPrice)}</span>
                      <span className="text-slate-900 font-bold">{formatINR(item.estimatedTotal)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 flex justify-between">
                    <span className="text-xs font-bold text-slate-700">Total Requirement</span>
                    <span className="text-xs font-extrabold text-emerald-700">{formatINR(req.totalAmount)}</span>
                  </div>
                </div>

                {req.aiSanityCheck && (
                  <div className={`mt-2 p-3 rounded-xl text-xs flex items-start gap-2 ${
                    req.aiSanityCheck.passed
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{req.aiSanityCheck.message}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 mb-1 transition-colors"
          >
            {expanded ? 'Hide details' : 'View itemised wishlist & quantities'}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </CardContent>

        <CardFooter className="flex items-center gap-2 bg-slate-50/80 border-t border-slate-100 p-4">
          <Button
            onClick={() => onDonate(req)}
            size="sm"
            className="flex-1 font-bold gap-1.5"
            disabled={req.status === 'fully_funded' || req.status === 'delivered'}
          >
            <HeartHandshake className="w-4 h-4" />
            {req.status === 'fully_funded' ? '✓ Fully Funded' : req.status === 'delivered' ? '✓ Delivered' : `Fulfill / Donate`}
          </Button>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Needed</span>
            <span className="text-xs font-bold text-slate-800">{formatINRCompact(req.totalAmount - req.fundedAmount)}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function NeedCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="h-1.5 bg-slate-200" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 w-full mt-4" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}
