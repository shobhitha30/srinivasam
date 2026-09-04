import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, ShieldCheck } from 'lucide-react';
import { mockDeliveryProofs } from '../../data/mockData';
import { formatDateTime } from '../../lib/utils';

export function ImpactGallery() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-slate-900 font-heading">Verified Impact Gallery</h3>
        <p className="text-sm text-slate-600 font-medium">Real delivery photos tagged with GPS coordinates & staff acknowledgements</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {mockDeliveryProofs.map((proof, i) => (
          <motion.div
            key={proof.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 transition-all shadow-xs"
          >
            {/* Before / After */}
            <div className={`grid ${proof.beforePhotoUrl ? 'grid-cols-2' : 'grid-cols-1'} gap-0.5 bg-slate-100`}>
              {proof.beforePhotoUrl && (
                <div className="relative aspect-video overflow-hidden">
                  <img src={proof.beforePhotoUrl} alt="Before delivery" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded-full">BEFORE</span>
                </div>
              )}
              <div className="relative aspect-video overflow-hidden">
                <img src={proof.afterPhotoUrl} alt="After delivery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full shadow-xs">VERIFIED DELIVERY</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Geo + time */}
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono text-slate-800">{proof.geoTag.lat.toFixed(4)}°N, {proof.geoTag.lng.toFixed(4)}°E</span>
                  <span className="text-slate-400 font-normal"> (±{proof.geoTag.accuracy}m)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  {formatDateTime(proof.timestamp)}
                </div>
              </div>

              {/* Vendor */}
              {proof.vendorName && (
                <div className="text-xs text-slate-600 font-medium">
                  📦 Delivered via <strong className="text-slate-900">{proof.vendorName}</strong>
                  {proof.vendorInvoiceNumber && <span className="ml-1 text-slate-400">· Invoice #{proof.vendorInvoiceNumber}</span>}
                </div>
              )}

              {/* Thank you note */}
              {proof.thankYouNote && (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span className="text-xs font-bold text-emerald-900">Message from {proof.staffName}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium italic">"{proof.thankYouNote}"</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                {proof.verifiedByStaff && (
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" /> Staff Verified
                  </span>
                )}
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  🔒 Tamper-Proof Audit Log
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
