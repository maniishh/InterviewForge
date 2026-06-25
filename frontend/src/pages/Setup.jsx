// src/pages/Setup.jsx
import { useState } from 'react';
import { Building2, Briefcase, Gauge, Sparkles, ChevronRight } from 'lucide-react';
import useInterview from '../hooks/useInterview';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
  'Netflix', 'Uber', 'Airbnb', 'Stripe', 'Flipkart',
];

const ROLES = [
  'Backend Engineer', 'Frontend Engineer', 'Full Stack Developer',
  'SDE-1', 'SDE-2', 'Senior Engineer', 'Data Engineer', 'DevOps Engineer',
];

const DIFFICULTIES = [
  {
    value: 'easy',
    label: 'Entry Level',
    desc:  '0–1 years experience',
    detail:'Fundamentals, basic algorithms, simple design',
    color: 'success',
    dot:   '#00D9A3',
  },
  {
    value: 'medium',
    label: 'Mid Level',
    desc:  '2–4 years experience',
    detail:'Problem solving, patterns, moderate design',
    color: 'accent',
    dot:   '#6C63FF',
  },
  {
    value: 'hard',
    label: 'Senior Level',
    desc:  '5+ years experience',
    detail:'Complex algorithms, system design, trade-offs',
    color: 'warning',
    dot:   '#FFB547',
  },
];

const COUNTS = [3, 5, 7, 10];

const Setup = () => {
  const { startInterview, isStarting } = useInterview();
  const { user } = useAuth();

  const [form, setForm] = useState({
    company:       '',
    jobRole:       '',
    difficulty:    'medium',
    questionCount: 5,
  });
  const [errors, setErrors] = useState({});
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showRoleSuggestions,    setShowRoleSuggestions]    = useState(false);

  const companySuggestions = COMPANIES.filter(c =>
    c.toLowerCase().includes(form.company.toLowerCase()) && form.company
  );
  const roleSuggestions = ROLES.filter(r =>
    r.toLowerCase().includes(form.jobRole.toLowerCase()) && form.jobRole
  );

  const validate = () => {
    const e = {};
    if (!form.company.trim())  e.company = 'Company name is required';
    if (!form.jobRole.trim())  e.jobRole = 'Job role is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    await startInterview(form);
  };

  return (
    <div className="min-h-screen bg-base">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 animate-slide-up">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-4">
            <Sparkles size={12} />
            AI Interview Session
          </div>
          <h1 className="text-4xl font-bold text-text-primary">
            Configure your interview
          </h1>
          <p className="text-text-muted mt-3 text-lg">
            Hey {user?.name?.split(' ')[0]} 👋 — set up your mock interview below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Company */}
          <Card className="p-6">
            <label className="flex items-center gap-2 text-sm font-semibold
                              text-text-primary mb-3">
              <Building2 size={16} className="text-accent" />
              Target Company
            </label>
            <div className="relative">
              <input
                className={`input-base ${errors.company ? 'border-danger' : ''}`}
                placeholder="e.g. Google, Amazon, Microsoft..."
                value={form.company}
                onChange={e => {
                  setForm(p => ({ ...p, company: e.target.value }));
                  setShowCompanySuggestions(true);
                  if (errors.company) setErrors(p => ({ ...p, company: '' }));
                }}
                onFocus={() => setShowCompanySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCompanySuggestions(false), 150)}
              />
              {showCompanySuggestions && companySuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-20
                                bg-elevated border border-border rounded-xl
                                shadow-card-lg overflow-hidden">
                  {companySuggestions.map(c => (
                    <button
                      key={c} type="button"
                      className="w-full text-left px-4 py-2.5 text-sm text-text-primary
                                 hover:bg-accent/10 hover:text-accent transition-colors"
                      onMouseDown={() => {
                        setForm(p => ({ ...p, company: c }));
                        setShowCompanySuggestions(false);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.company && (
              <p className="text-xs text-danger mt-1.5">⚠ {errors.company}</p>
            )}

            {/* Quick select chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {COMPANIES.slice(0, 6).map(c => (
                <button
                  key={c} type="button"
                  onClick={() => setForm(p => ({ ...p, company: c }))}
                  className={`px-3 py-1 rounded-full text-xs font-medium border
                              transition-all duration-200
                              ${form.company === c
                                ? 'bg-accent/20 border-accent text-accent'
                                : 'bg-elevated border-border text-text-muted hover:border-accent/50 hover:text-text-primary'
                              }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Card>

          {/* Role */}
          <Card className="p-6">
            <label className="flex items-center gap-2 text-sm font-semibold
                              text-text-primary mb-3">
              <Briefcase size={16} className="text-accent" />
              Job Role
            </label>
            <div className="relative">
              <input
                className={`input-base ${errors.jobRole ? 'border-danger' : ''}`}
                placeholder="e.g. Backend Engineer, SDE-2..."
                value={form.jobRole}
                onChange={e => {
                  setForm(p => ({ ...p, jobRole: e.target.value }));
                  setShowRoleSuggestions(true);
                  if (errors.jobRole) setErrors(p => ({ ...p, jobRole: '' }));
                }}
                onFocus={() => setShowRoleSuggestions(true)}
                onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 150)}
              />
              {showRoleSuggestions && roleSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-20
                                bg-elevated border border-border rounded-xl
                                shadow-card-lg overflow-hidden">
                  {roleSuggestions.map(r => (
                    <button
                      key={r} type="button"
                      className="w-full text-left px-4 py-2.5 text-sm text-text-primary
                                 hover:bg-accent/10 hover:text-accent transition-colors"
                      onMouseDown={() => {
                        setForm(p => ({ ...p, jobRole: r }));
                        setShowRoleSuggestions(false);
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.jobRole && (
              <p className="text-xs text-danger mt-1.5">⚠ {errors.jobRole}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {ROLES.slice(0, 5).map(r => (
                <button
                  key={r} type="button"
                  onClick={() => setForm(p => ({ ...p, jobRole: r }))}
                  className={`px-3 py-1 rounded-full text-xs font-medium border
                              transition-all duration-200
                              ${form.jobRole === r
                                ? 'bg-accent/20 border-accent text-accent'
                                : 'bg-elevated border-border text-text-muted hover:border-accent/50 hover:text-text-primary'
                              }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </Card>

          {/* Difficulty */}
          <Card className="p-6">
            <label className="flex items-center gap-2 text-sm font-semibold
                              text-text-primary mb-4">
              <Gauge size={16} className="text-accent" />
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.value} type="button"
                  onClick={() => setForm(p => ({ ...p, difficulty: d.value }))}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-200
                              ${form.difficulty === d.value
                                ? 'border-opacity-100 bg-opacity-10'
                                : 'border-border bg-elevated hover:border-opacity-50'
                              }`}
                  style={form.difficulty === d.value ? {
                    borderColor: d.dot,
                    background:  `${d.dot}10`,
                  } : {}}
                >
                  <div className="w-2 h-2 rounded-full mb-3"
                       style={{ background: d.dot }} />
                  <p className="font-semibold text-sm text-text-primary">{d.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{d.desc}</p>
                  <p className="text-xs mt-2 leading-relaxed"
                     style={{ color: form.difficulty === d.value ? d.dot : '#6B6A7D' }}>
                    {d.detail}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* Question count */}
          <Card className="p-6">
            <label className="text-sm font-semibold text-text-primary mb-4 block">
              Number of Questions
            </label>
            <div className="flex gap-3">
              {COUNTS.map(n => (
                <button
                  key={n} type="button"
                  onClick={() => setForm(p => ({ ...p, questionCount: n }))}
                  className={`flex-1 py-3 rounded-xl border font-mono font-bold text-lg
                              transition-all duration-200
                              ${form.questionCount === n
                                ? 'bg-accent/10 border-accent text-accent'
                                : 'bg-elevated border-border text-text-muted hover:border-accent/40'
                              }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-3 text-center">
              {form.questionCount} questions · ~{form.questionCount * 3}–{form.questionCount * 5} minutes
            </p>
          </Card>

          {/* Submit */}
        

<Button
  type="submit"
  className="w-full py-4 text-base"
  size="lg"
  isLoading={isStarting}
  loadingText="Generating questions... (may take up to 60 seconds)"
  rightIcon={<ChevronRight size={18} />}
>
  Start Interview
</Button>

{/* Add this below the button */}
<p className="text-center text-xs text-text-muted mt-3">
  First load may take 30–60 seconds while AI generates your questions
</p>
        </form>
      </div>
    </div>
  );
};

export default Setup;