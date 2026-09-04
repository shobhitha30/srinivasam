import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronRight, Bot, CheckCircle2 } from 'lucide-react';
import { Modal, Button, Input, Select, Textarea, StepIndicator, Badge } from '../ui';
import type { RequirementCategory, RequirementPriority, RequirementItem } from '../../types';
import { formatINR } from '../../lib/utils';
import { toast } from 'sonner';

const CATEGORIES: RequirementCategory[] = ['Groceries', 'Education', 'Medicines', 'Hygiene', 'Clothing', 'Infrastructure', 'Stationery', 'Other'];
const PRIORITIES: { value: RequirementPriority; label: string; desc: string }[] = [
  { value: 'urgent', label: '🔴 Urgent Need', desc: 'Required within 3 days' },
  { value: 'recurring', label: '🟡 Monthly Recurring', desc: 'Repeating essential need' },
  { value: 'standard', label: '🔵 Standard Need', desc: 'Regular planned requirement' },
];

interface CreateRequirementWizardProps {
  open: boolean;
  onClose: () => void;
  childrenCount: number;
}

export function CreateRequirementWizard({ open, onClose, childrenCount }: CreateRequirementWizardProps) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<RequirementCategory>('Groceries');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<RequirementPriority>('standard');
  const [deadline, setDeadline] = useState('');
  const [items, setItems] = useState<RequirementItem[]>([
    { id: '1', name: '', unit: 'pcs', quantity: 1, unitPrice: 0, estimatedTotal: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [aiChecking, setAiChecking] = useState(false);
  const [aiResult, setAiResult] = useState<{ passed: boolean; message: string } | null>(null);

  const totalAmount = items.reduce((s, i) => s + i.estimatedTotal, 0);

  const addItem = () => setItems([...items, { id: Date.now().toString(), name: '', unit: 'pcs', quantity: 1, unitPrice: 0, estimatedTotal: 0 }]);
  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));
  const updateItem = (id: string, field: keyof RequirementItem, value: string | number) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      updated.estimatedTotal = updated.quantity * updated.unitPrice;
      return updated;
    }));
  };

  const runAiCheck = async () => {
    setAiChecking(true);
    await new Promise((r) => setTimeout(r, 1200));
    const perChild = totalAmount / childrenCount;
    const passed = perChild < 5000;
    setAiResult({
      passed,
      message: passed
        ? `✅ Sanity check passed! Estimated cost per child is ${formatINR(Math.round(perChild))} — well within standard benchmark for ${childrenCount} resident children.`
        : `⚠️ Cost per child (${formatINR(Math.round(perChild))}) is high. Please double check item quantities.`,
    });
    setAiChecking(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    toast.success('Requirement submitted for admin approval!', { description: 'You will receive a notification once verified & live.' });
    onClose();
    setStep(0);
  };

  const steps = ['Category & Details', 'Itemised Wishlist', 'Review & Submit'];

  return (
    <Modal open={open} onClose={onClose} title="Submit Need Request" size="xl">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <StepIndicator steps={steps} current={step} />
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        category === cat
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <Input label="Campaign Title" placeholder="e.g. Monthly Grocery Supplies — October 2026" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea label="Context & Purpose (optional)" placeholder="Explain how these items will serve the children..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Priority Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        priority === p.value
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-sm">{p.label}</div>
                      <div className="text-xs opacity-75 mt-0.5 font-medium">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Target Fulfillment Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="text-left py-2 pr-3 font-bold">Item Name</th>
                      <th className="text-left py-2 px-2 font-bold w-24">Unit</th>
                      <th className="text-left py-2 px-2 font-bold w-20">Qty</th>
                      <th className="text-left py-2 px-2 font-bold w-28">Est. Unit Price (₹)</th>
                      <th className="text-right py-2 pl-2 font-bold w-28">Total</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="py-2 pr-3">
                          <input value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} placeholder="e.g. Rice (Sona Masuri)" className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-2.5 py-1.5 text-sm focus:outline-none focus:border-emerald-600 font-medium" />
                        </td>
                        <td className="py-2 px-2">
                          <select value={item.unit} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-600 font-medium">
                            {['pcs', 'kg', 'litre', 'pack', 'box', 'bottles', 'strips', 'pairs', 'kits'].map((u) => <option key={u}>{u}</option>)}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-600 font-bold text-center" />
                        </td>
                        <td className="py-2 px-2">
                          <input type="number" min="0" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded-lg text-slate-900 px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-600 font-medium" />
                        </td>
                        <td className="py-2 pl-2 text-right font-extrabold text-emerald-700">{formatINR(item.estimatedTotal)}</td>
                        <td className="py-2 pl-1">
                          {items.length > 1 && (
                            <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-600 transition-colors p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="pt-3 text-right font-bold text-slate-700 text-sm">Estimated Total Amount:</td>
                      <td className="pt-3 text-right font-extrabold text-slate-900 text-lg">{formatINR(totalAmount)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
              <Button variant="outline" size="sm" onClick={addItem} className="gap-1.5 font-bold">
                <Plus className="w-4 h-4" />Add Another Item
              </Button>

              {/* AI Sanity Check */}
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-700" />
                    <span className="text-sm font-bold text-slate-900">AI Headcount Benchmark Check</span>
                    <span className="text-xs text-slate-500 font-medium">({childrenCount} resident children)</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={runAiCheck} loading={aiChecking} className="gap-1 font-bold">
                    {aiChecking ? 'Evaluating...' : 'Run Benchmark'}
                  </Button>
                </div>
                {aiResult && (
                  <div className={`p-3 rounded-lg text-xs font-semibold leading-relaxed ${aiResult.passed ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'}`}>
                    {aiResult.message}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-5">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={priority === 'urgent' ? 'urgent' : priority === 'recurring' ? 'recurring' : 'standard'}>{priority} priority</Badge>
                  <Badge variant="info">{category}</Badge>
                </div>
                <h3 className="text-slate-900 font-bold text-lg font-heading">{title || 'Untitled Request'}</h3>
                {description && <p className="text-sm text-slate-600">{description}</p>}
                {deadline && <p className="text-xs text-slate-500 font-medium">📅 Target Deadline: {new Date(deadline).toLocaleDateString('en-IN')}</p>}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-bold text-slate-800">Itemized Breakdown</div>
                {items.filter(i => i.name).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3.5 py-2 border border-slate-200">
                    <span className="text-slate-800 font-medium">{item.name}</span>
                    <span className="text-slate-500 font-medium">{item.quantity} {item.unit}</span>
                    <span className="text-slate-900 font-bold">{formatINR(item.estimatedTotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 px-3">
                  <span className="font-bold text-slate-800">Total Funding Requested</span>
                  <span className="text-xl font-extrabold text-emerald-700">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 font-medium leading-relaxed">
                ℹ️ Once submitted, your request will be routed to the Admin Governance Queue for verification before appearing live on the public feed.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <Button variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : onClose()} className="font-bold">
          {step === 0 ? 'Cancel' : '← Back'}
        </Button>
        {step < 2 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 0 && !title} className="font-bold">
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading} variant="success" className="font-bold">
            Submit Request to Verification Queue
          </Button>
        )}
      </div>
    </Modal>
  );
}
