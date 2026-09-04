import { motion } from 'framer-motion';
import { Users, Home, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { UserRole } from '../../types';
import { cn } from '../../lib/utils';

const roles: { id: UserRole; label: string; icon: React.ReactNode; activeBg: string }[] = [
  { id: 'public', label: 'Public View', icon: <Globe className="w-3.5 h-3.5" />, activeBg: 'bg-white text-slate-900 shadow-sm border border-slate-200' },
  { id: 'donor', label: 'Donor Portal', icon: <Users className="w-3.5 h-3.5" />, activeBg: 'bg-emerald-600 text-white shadow-sm' },
  { id: 'shelter', label: 'Shelter Hub', icon: <Home className="w-3.5 h-3.5" />, activeBg: 'bg-emerald-700 text-white shadow-sm' },
  { id: 'admin', label: 'Admin Console', icon: <ShieldCheck className="w-3.5 h-3.5" />, activeBg: 'bg-slate-900 text-white shadow-sm' },
];

export function RoleSwitcherBar() {
  const { activeRole, setRole } = useAppStore();
  return (
    <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Live Demo Perspective Switcher
          </span>
        </div>
        <div className="flex items-center gap-1">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setRole(role.id)}
              className={cn(
                'relative flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200',
                activeRole === role.id ? role.activeBg : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              {activeRole === role.id && (
                <motion.div
                  layoutId="roleActive"
                  className="absolute inset-0 rounded-lg"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {role.icon}
                <span className="hidden sm:block">{role.label}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="text-[11px] text-slate-400 hidden lg:block font-medium">srinivasam.inc</div>
      </div>
    </div>
  );
}
