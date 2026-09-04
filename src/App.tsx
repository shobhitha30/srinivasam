import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Navbar } from './components/layout/Navbar';
import { useAppStore } from './store/useAppStore';
import { HomePage } from './pages/HomePage';
import { DonorPage } from './pages/DonorPage';
import { ShelterPage } from './pages/ShelterPage';
import { AdminPage } from './pages/AdminPage';

const queryClient = new QueryClient();

function PageContent() {
  const { activeRole } = useAppStore();

  const pages: Record<string, React.ReactNode> = {
    public: <HomePage />,
    donor: <DonorPage />,
    shelter: <ShelterPage />,
    admin: <AdminPage />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeRole}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {pages[activeRole]}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <RoleSwitcherBar />
        <Navbar />
        <main className="flex-1">
          <PageContent />
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <span className="text-white font-bold text-xl font-heading">Srinivasam.inc</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  India's verified NGO direct-fulfillment platform. Connecting orphanages, donors, and quick-commerce vendors with 100% transparency.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Platform Links</h4>
                <ul className="space-y-2 text-xs font-medium text-slate-400">
                  <li><a href="#needs" className="hover:text-white transition-colors">Immediate Needs Feed</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                  <li><a href="#tax-info" className="hover:text-white transition-colors">Section 80G Tax Deductions</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Register Orphanage / NGO</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Governance & Trust</h4>
                <ul className="space-y-2 text-xs font-medium text-slate-400">
                  <li><span className="text-slate-300">CBDT Reg:</span> AAATS9823F20231</li>
                  <li><span className="text-slate-300">Section 80G:</span> CIT(E)/80G/2023-24</li>
                  <li><span className="text-slate-300">FCRA Compliance:</span> Active</li>
                  <li><span className="text-slate-300">Audit Partner:</span> KPMG Audit</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Sustainable Impact</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium mb-3">
                  0% cash leakage promise. All fulfillments are converted directly into food items, stationery, and medicines routed via verified local partners.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg">
                  🌿 Sustainable Giving Initiative
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
              <span>© 2026 Srinivasam Impact Foundation. All rights reserved.</span>
              <div className="flex gap-6">
                <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-slate-300 transition-colors">CSR Compliance</a>
                <a href="#" className="hover:text-slate-300 transition-colors">Contact Us</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' },
        }}
        richColors
      />
    </QueryClientProvider>
  );
}
