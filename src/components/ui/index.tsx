import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';
    const variants = {
      primary: 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm shadow-emerald-600/20 hover:shadow-md',
      secondary: 'bg-slate-900 hover:bg-slate-800 active:scale-95 text-white shadow-sm',
      ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 active:scale-95',
      danger: 'bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-sm shadow-rose-600/20',
      outline: 'border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 text-slate-700 active:scale-95 bg-white shadow-sm',
      success: 'bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white shadow-sm shadow-emerald-700/20',
    };
    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 h-8',
      md: 'text-sm px-4 py-2.5 h-10',
      lg: 'text-base px-6 py-3.5 h-12',
      icon: 'h-9 w-9 p-0',
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  variant?: 'urgent' | 'recurring' | 'standard' | 'verified' | 'pending' | 'success' | 'warning' | 'info' | 'error';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = 'info', children, className, dot }: BadgeProps) {
  const variants = {
    urgent: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    recurring: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    standard: 'bg-slate-100 text-slate-700 border border-slate-200',
    verified: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    pending: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    info: 'bg-sky-50 text-sky-800 border border-sky-200/80',
    error: 'bg-rose-50 text-rose-700 border border-rose-200/80',
  };
  const dotColors = {
    urgent: 'bg-rose-500', recurring: 'bg-amber-500', standard: 'bg-slate-400',
    verified: 'bg-emerald-500', pending: 'bg-amber-500', success: 'bg-emerald-500',
    warning: 'bg-amber-500', info: 'bg-sky-500', error: 'bg-rose-500',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full', variants[variant], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border border-slate-200/80 rounded-2xl shadow-sm',
        hover && 'hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-5 pb-4', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 pb-5', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl', className)}>{children}</div>;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  color?: 'emerald' | 'sky' | 'amber' | 'red';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, className, color = 'emerald', showLabel, size = 'md' }: ProgressBarProps) {
  const colors = {
    emerald: 'bg-emerald-500',
    sky: 'bg-sky-500',
    amber: 'bg-amber-500',
    red: 'bg-rose-500',
  };
  const heights = { sm: 'h-1.5', md: 'h-2.5' };
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60', heights[size])}>
        <motion.div
          className={cn('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-slate-500 mt-1 font-medium">{value}% funded</div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={cn(
              'relative w-full bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden text-slate-900',
              sizes[size]
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-200/60">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="overflow-y-auto max-h-[85vh]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, suffix, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-slate-400 text-sm font-medium">{prefix}</span>}
        <input
          ref={ref}
          className={cn(
            'w-full bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 transition-all shadow-2xs',
            'focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10',
            prefix ? 'pl-9' : 'pl-3.5',
            suffix ? 'pr-9' : 'pr-3.5',
            'py-2.5 h-10.5',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10',
            className
          )}
          {...props}
        />
        {suffix && <span className="absolute right-3 text-slate-400 text-sm font-medium">{suffix}</span>}
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-slate-200/80 rounded-xl', className)} />;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: 'emerald' | 'sky' | 'amber' | 'purple';
  loading?: boolean;
}

export function StatCard({ label, value, icon, trend, color = 'sky', loading }: StatCardProps) {
  const colors = {
    emerald: 'bg-emerald-50/80 border-emerald-200/80 text-emerald-700',
    sky: 'bg-sky-50/80 border-sky-200/80 text-sky-700',
    amber: 'bg-amber-50/80 border-amber-200/80 text-amber-700',
    purple: 'bg-purple-50/80 border-purple-200/80 text-purple-700',
  };
  if (loading) return <Skeleton className="h-28" />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm', colors[color].split(' ')[1])}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2.5 rounded-xl border', colors[color])}>{icon}</div>
        {trend && <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-0.5 tracking-tight">{value}</div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
    </motion.div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

interface TabItem { id: string; label: string; icon?: React.ReactNode; count?: number }

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
            active === tab.id ? 'text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          )}
        >
          {active === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-lg border border-slate-200/60"
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-bold', active === tab.id ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600')}>
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <select
        ref={ref}
        className={cn(
          'w-full bg-white border border-slate-200 rounded-xl text-sm text-slate-900 px-3.5 py-2.5 h-10.5 shadow-2xs',
          'focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all',
          'appearance-none cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-white text-slate-900">{o.label}</option>
        ))}
      </select>
    </div>
  )
);
Select.displayName = 'Select';

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          'w-full bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 shadow-2xs',
          'focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all px-3.5 py-2.5 resize-none',
          error && 'border-rose-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';

// ─── Step Indicator ───────────────────────────────────────────────────────────

interface StepIndicatorProps {
  steps: string[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
              i < current ? 'bg-emerald-600 border-emerald-600 text-white' :
              i === current ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20' :
              'bg-slate-100 border-slate-300 text-slate-400'
            )}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={cn('text-xs mt-1.5 font-semibold whitespace-nowrap', i === current ? 'text-emerald-700' : 'text-slate-500')}>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('h-0.5 flex-1 mx-2 mb-5 transition-all duration-500', i < current ? 'bg-emerald-600' : 'bg-slate-200')} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
