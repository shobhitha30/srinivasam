import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Heart, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '../ui';
import { StatsTicker } from './StatsTicker';
import { platformStats } from '../../data/mockData';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-emerald-50/70 via-slate-50 to-slate-50 pt-12 pb-16 px-4 sm:px-6 overflow-hidden border-b border-slate-200/60">
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center pt-6">
        {/* Trust Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-emerald-100/90 border border-emerald-300/80 rounded-full px-4 py-1.5 mb-6 shadow-2xs"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-emerald-900 tracking-wide">
            100% Verified Orphanage & NGO Direct Fulfillment
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.12] tracking-tight font-heading"
        >
          Warm Hearts.{' '}
          <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">
            Real Food.
          </span>
          <br />
          <span className="text-sky-700">100% Verified Impact.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-medium"
        >
          Srinivasam connects caring donors directly with verified children's homes and orphanages.
          Your contributions fund exact itemised groceries and medical supplies — backed by geotagged proof and 80G tax benefits.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <Button size="lg" className="w-full sm:w-auto shadow-md">
            <span>Explore Immediate Needs</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Register an NGO / Orphanage
          </Button>
        </motion.div>

        {/* Humanized Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-600 font-semibold mb-10"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Cash Leaks
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Geotagged Delivery Proof
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automated Section 80G Receipts
          </span>
        </motion.div>

        {/* Live Stats Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <StatsTicker stats={platformStats} />
        </motion.div>
      </div>
    </section>
  );
}
