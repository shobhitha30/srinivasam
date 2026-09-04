import { useState } from 'react';
import { HeroSection } from '../components/public/HeroSection';
import { UrgentNeedsFeed } from '../components/public/UrgentNeedsFeed';
import { ImpactFlowDiagram } from '../components/public/ImpactFlowDiagram';
import { DonationDrawer } from '../components/donor/DonationDrawer';
import type { Requirement } from '../types';

export function HomePage() {
  const [donateTarget, setDonateTarget] = useState<Requirement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDonate = (req: Requirement) => {
    setDonateTarget(req);
    setDrawerOpen(true);
  };

  return (
    <div>
      <HeroSection />
      <UrgentNeedsFeed onDonate={handleDonate} />
      <ImpactFlowDiagram />

      {/* 80G Section */}
      <section id="tax-info" className="py-16 px-4 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-emerald-300 tracking-wider uppercase mb-3 block">
            Maximize Your Giving
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-heading">
            Section 80G Tax Exemption Benefits
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            All partner orphanages & NGOs are registered under Section 80G of the Income Tax Act, 1961.
            Your contributions qualify for up to <strong className="text-white underline decoration-emerald-400">50% tax deduction</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            {[
              { icon: '📋', title: 'Automated 80G PDF', desc: 'Instant downloadable receipt generated upon payment with mandatory PAN & CBDT registration details.' },
              { icon: '🏦', title: 'Pre-filled ITR Filing', desc: 'Directly linked with your PAN card for seamless income tax return filing for AY 2026–27.' },
              { icon: '✅', title: '100% Validated 12A/80G', desc: 'Every registered shelter holds verified 12A and 80G certificates validated by our compliance vault.' },
            ].map((item) => (
              <div key={item.title} className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-bold text-white text-lg mb-1.5 font-heading">{item.title}</div>
                <div className="text-xs text-emerald-200 leading-relaxed font-medium">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DonationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} requirement={donateTarget} />
    </div>
  );
}
