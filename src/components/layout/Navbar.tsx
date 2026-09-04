import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, ChevronRight, ShieldCheck, Leaf } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui';
import { cn } from '../../lib/utils';

const navLinks: Record<string, { label: string; href: string }[]> = {
  public: [
    { label: 'Immediate Needs', href: '#needs' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Tax Benefits (80G)', href: '#tax-info' },
    { label: 'Register Shelter', href: '#register' },
  ],
  donor: [
    { label: 'My Contributions', href: '#contributions' },
    { label: 'Impact Gallery', href: '#gallery' },
    { label: 'Recurring Care', href: '#recurring' },
  ],
  shelter: [
    { label: 'Overview', href: '#overview' },
    { label: 'My Requests', href: '#requests' },
    { label: 'Delivery Proofs', href: '#proofs' },
    { label: 'KYC Vault', href: '#kyc' },
  ],
  admin: [
    { label: 'Verifications', href: '#verifications' },
    { label: 'Moderation', href: '#moderation' },
    { label: 'Dispatch', href: '#dispatch' },
    { label: 'Audit Logs', href: '#audit' },
  ],
};

export function Navbar() {
  const { activeRole } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = navLinks[activeRole] || navLinks.public;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-[37px] z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-900 font-extrabold text-xl leading-tight font-heading">Srinivasam</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">.inc</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium leading-none block">Direct Impact & Verification Platform</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 hover:text-emerald-700 px-3.5 py-2 rounded-lg hover:bg-emerald-50/60 transition-all font-semibold"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {activeRole === 'public' && (
              <>
                <Button variant="outline" size="sm">Sign In</Button>
                <Button size="sm">Explore Needs <ChevronRight className="w-4 h-4" /></Button>
              </>
            )}
            {activeRole === 'donor' && (
              <Button size="sm" variant="primary">+ Make a Contribution</Button>
            )}
            {activeRole === 'shelter' && (
              <Button size="sm" variant="success">+ Submit Need Request</Button>
            )}
            {activeRole === 'admin' && (
              <Button size="sm" variant="secondary">Export Audit Logs</Button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-700 hover:text-emerald-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-200 bg-white overflow-hidden shadow-lg"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-slate-700 hover:text-emerald-700 font-semibold px-3 py-2.5 rounded-lg hover:bg-emerald-50 transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2">
                <Button className="w-full">Explore Needs</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
