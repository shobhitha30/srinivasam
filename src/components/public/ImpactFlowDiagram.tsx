import { motion } from 'framer-motion';
import { ShieldCheck, ShoppingCart, MapPin, FileText, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Verified Need Request',
    description: 'Admin-verified orphanages list itemised needs with automated AI checks for headcount & quantities.',
    color: 'bg-emerald-600 text-white',
    textColor: 'text-emerald-900',
    border: 'border-emerald-200/80',
    bg: 'bg-emerald-50/50',
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    title: 'Direct Vendor Order',
    description: 'Donations are directly converted to purchase orders routed to local grocers or Quick-Commerce partners.',
    color: 'bg-sky-600 text-white',
    textColor: 'text-sky-900',
    border: 'border-sky-200/80',
    bg: 'bg-sky-50/50',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Geotagged Proof',
    description: 'Shelter staff uploads delivery photo, GPS coordinates, timestamp & vendor invoice upon receipt.',
    color: 'bg-purple-600 text-white',
    textColor: 'text-purple-900',
    border: 'border-purple-200/80',
    bg: 'bg-purple-50/50',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Instant 80G Tax Receipt',
    description: 'Donors instantly download automated Section 80G tax receipts for 50% income tax deductions.',
    color: 'bg-amber-600 text-white',
    textColor: 'text-amber-900',
    border: 'border-amber-200/80',
    bg: 'bg-amber-50/50',
  },
];

export function ImpactFlowDiagram() {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-white border-t border-b border-slate-200/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase mb-2 block">
            Transparent & Accountable
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 font-heading">
            How Your Impact Travels
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-base">
            Every rupee is tracked from donation to delivery. Zero cash intermediaries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`relative border rounded-2xl p-5 ${step.bg} ${step.border} shadow-2xs`}
            >
              {/* Step Number */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  {step.icon}
                </div>
                <span className="text-xs font-extrabold text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                  Step 0{i + 1}
                </span>
              </div>

              <h3 className={`font-bold text-base mb-2 ${step.textColor} font-heading`}>{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
