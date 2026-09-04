import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NeedCard, NeedCardSkeleton } from './NeedCard';
import { FilterBar } from './FilterBar';
import { useRequirements } from '../../hooks/useRequirements';
import type { FilterState, Requirement } from '../../types';

interface UrgentNeedsFeedProps {
  onDonate: (req: Requirement) => void;
}

export function UrgentNeedsFeed({ onDonate }: UrgentNeedsFeedProps) {
  const [filters, setFilters] = useState<FilterState>({ category: 'All', city: '', status: 'All', search: '' });
  const { requirements, isLoading } = useRequirements(filters);

  return (
    <section id="needs" className="py-14 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-rose-600 tracking-wider uppercase mb-1 block">
              ⚡ Verified Live Feed
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Immediate Needs & Campaigns
            </h2>
          </div>
          <p className="text-slate-600 text-sm max-w-sm font-medium">
            All requests are verified by our audit team with AI sanity checks on quantities per child.
          </p>
        </div>

        <div className="mb-8">
          <FilterBar filters={filters} onChange={setFilters} totalCount={requirements.length} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <NeedCardSkeleton key={i} />)}
          </div>
        ) : requirements.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <div className="text-5xl mb-3">🌱</div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No needs found matching criteria</h3>
            <p className="text-sm text-slate-500">Try adjusting your category or city filters</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {requirements.map((req) => (
                <NeedCard key={req.id} requirement={req} onDonate={onDonate} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
