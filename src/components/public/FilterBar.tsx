import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Select, Button } from '../ui';
import type { FilterState, RequirementCategory } from '../../types';
import { cn } from '../../lib/utils';

const CATEGORIES: (RequirementCategory | 'All')[] = ['All', 'Groceries', 'Education', 'Medicines', 'Hygiene', 'Clothing', 'Stationery'];
const CITIES = ['All', 'Bengaluru', 'Mumbai', 'Chennai', 'Delhi', 'Hyderabad', 'Pune'];
const STATUSES = [
  { value: 'All', label: 'All Status' },
  { value: 'active', label: 'Accepting Donations' },
  { value: 'partially_funded', label: 'Partially Funded' },
  { value: 'fully_funded', label: 'Fully Funded' },
];

interface FilterBarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  totalCount: number;
}

export function FilterBar({ filters, onChange, totalCount }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (key: keyof FilterState, value: string) => onChange({ ...filters, [key]: value });
  const reset = () => onChange({ category: 'All', city: '', status: 'All', search: '' });
  const hasFilters = filters.category !== 'All' || filters.city !== '' || filters.status !== 'All' || filters.search !== '';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-4 shadow-sm">
      {/* Search + toggle */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Search orphanages, essential items, cities..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 h-10.5 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-medium"
          />
          {filters.search && (
            <button onClick={() => update('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button variant="outline" size="md" onClick={() => setShowAdvanced(!showAdvanced)} className="gap-2 flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:block">Filters</span>
          {hasFilters && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="md" onClick={reset} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => update('category', cat)}
            className={cn(
              'text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200',
              filters.category === cat
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-600 hover:text-emerald-700'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <Select
            label="City / Region"
            value={filters.city}
            onChange={(e) => update('city', e.target.value)}
            options={CITIES.map((c) => ({ value: c === 'All' ? '' : c, label: c }))}
          />
          <Select
            label="Funding Progress Status"
            value={filters.status}
            onChange={(e) => update('status', e.target.value as FilterState['status'])}
            options={STATUSES}
          />
        </div>
      )}

      {/* Results count */}
      <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
        <span>Showing <strong className="text-slate-900">{totalCount}</strong> verified impact campaigns</span>
        {hasFilters && <span className="text-emerald-700 font-bold">(Filters applied)</span>}
      </div>
    </div>
  );
}
