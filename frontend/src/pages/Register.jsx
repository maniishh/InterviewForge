// src/pages/Register.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

/* Password strength rules */
const RULES = [
  { id: 'len',   label: 'At least 8 characters',           test: p => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter',             test: p => /[A-Z]/.test(p) },
  { id: 'lower', label: 'One lowercase letter',             test: p => /[a-z]/.test(p) },
  { id: 'num',   label: 'One number',                       test: p => /\d/.test(p) },
];

const getStrength = (pass) => {
  const passed = RULES.filter(r => r.test(pass)).length;
  if (passed <= 1) return { level: 0, label: 'Weak',   color: '#FF5757' };
  if (passed <= 2) return { level: 1, label: 'Fair',   color: '#FFB547' };
  if (passed <= 3) return { level: 2, label: 'Good',   color: '#6C63FF' };
  return              { level: 3, label: 'Strong', color: '#00D9A3' };
};

const Register = () => {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [errors,      setErrors]      = useState({});
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [serverError, setServerError] = useState('');

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 8)       e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword)            e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password, form.confirmPassword);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-center w-[45%] bg-surface
                      border-r border-border p-12 gradient-mesh relative overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full
                        bg-accent/5 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center
                          shadow-accent text-white font-bold text-sm">IF</div>
          <span className="text-xl font-bold">
            Interview<span className="text-accent">Forge</span>
          </span>
        </div>

        <h2 className="text-4xl font-bold leading-tight mb-4">
          Start your journey<br />
          <span className="text-gradient">to your dream job</span>
        </h2>
        <p className="text-text-muted leading-relaxed">
          Join thousands of engineers who practise smarter,
          get targeted feedback, and walk into interviews confident.
        </p>

        {/* Testimonial */}
        <div className="mt-12 p-5 rounded-2xl bg-elevated border border-border">
          <p className="text-sm text-text-primary leading-relaxed">
            "InterviewForge helped me go from failing every Google screen
            to getting an SDE-2 offer in 6 weeks. The AI feedback is shockingly specific."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30
                            flex items-center justify-center text-accent text-xs font-bold">R</div>
            <div>
              <p className="text-xs font-semibold text-text-primary">Rahul M.</p>
              <p className="text-xs text-text-muted">SDE-2 at Google</p>
            </div>
            <div className="ml-auto flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-warning text-xs">★</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto animate-slide-up">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-primary">Create account</h2>
            <p className="text-text-muted mt-2">Free forever. No credit card needed.</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20
                            text-danger text-sm">
              ⚠ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Manish Yadav"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
              autoFocus
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
            />

            {/* Password with strength indicator */}
            <div className="space-y-2">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
                rightIcon={
                  <button type="button" onClick={() => setShowPass(p => !p)}
                          className="hover:text-text-primary transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {/* Strength bar */}
              {form.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                           style={{
                             background: i <= strength.level ? strength.color : '#1E1E2E'
                           }} />
                    ))}
                    <span className="text-xs font-medium ml-1"
                          style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>

                  {/* Rules checklist */}
                  <div className="grid grid-cols-2 gap-1">
                    {RULES.map(rule => {
                      const ok = rule.test(form.password);
                      return (
                        <div key={rule.id}
                             className={`flex items-center gap-1.5 text-xs transition-colors
                               ${ok ? 'text-success' : 'text-text-muted'}`}>
                          {ok
                            ? <Check size={10} className="flex-shrink-0" />
                            : <X size={10} className="flex-shrink-0" />}
                          {rule.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              rightIcon={
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                        className="hover:text-text-primary transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
              loadingText="Creating account..."
              rightIcon={<ArrowRight size={16} />}
            >
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login"
                  className="text-accent hover:text-accent-hover font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;