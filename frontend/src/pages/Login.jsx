// src/pages/Login.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Brain, Code2, Trophy, Zap } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const FEATURES = [
  { icon: Brain,  title: 'AI-Powered Questions',  desc: 'Company-specific questions tailored to your target role' },
  { icon: Code2,  title: '4-Dimension Scoring',   desc: 'Technical, Communication, Depth & Overall feedback' },
  { icon: Trophy, title: 'Track Progress',         desc: 'Full history with detailed per-question breakdown' },
];

const Login = () => {
  const { login } = useAuth();

  const [form,        setForm]        = useState({ email: '', password: '' });
  const [errors,      setErrors]      = useState({});
  const [showPass,    setShowPass]    = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email)                           e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = 'Enter a valid email';
    if (!form.password)                         e.password = 'Password is required';
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
      await login(form.email, form.password);
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
    <div className="min-h-screen w-full flex" style={{ background: '#0A0A0F' }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: '#111118', borderRight: '1px solid #1E1E2E' }}
      >
        {/* Background glow orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '-5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-5%',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,217,163,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: '#6C63FF', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: '700',
            fontSize: '14px', boxShadow: '0 0 20px rgba(108,99,255,0.4)',
          }}>
            IF
          </div>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#F0EFF8' }}>
            Interview<span style={{ color: '#6C63FF' }}>Forge</span>
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10" style={{ margin: 'auto 0' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '999px',
            background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)',
            color: '#6C63FF', fontSize: '12px', fontWeight: '500',
            marginBottom: '24px',
          }}>
            <Zap size={11} />
            AI-Powered Interview Preparation
          </div>

          <h1 style={{
            fontSize: '42px', fontWeight: '800', lineHeight: '1.15',
            color: '#F0EFF8', marginBottom: '16px',
          }}>
            Ace your next<br />
            <span style={{
              background: 'linear-gradient(135deg, #F0EFF8 0%, #6C63FF 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              tech interview
            </span><br />
            with AI feedback
          </h1>

          <p style={{
            color: '#6B6A7D', fontSize: '16px', lineHeight: '1.6',
            maxWidth: '380px', marginBottom: '36px',
          }}>
            Practice with realistic questions tailored to your target company.
            Get instant, detailed feedback on every answer.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                  background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} color="#6C63FF" />
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#F0EFF8', marginBottom: '2px' }}>
                    {title}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6B6A7D', lineHeight: '1.5' }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div style={{
          display: 'flex', gap: '32px', paddingTop: '24px',
          borderTop: '1px solid #1E1E2E', position: 'relative', zIndex: 10,
        }}>
          {[['500+', 'Questions'], ['4', 'Score Dimensions'], ['10+', 'Companies']].map(([n, l]) => (
            <div key={l}>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#6C63FF', fontFamily: 'monospace' }}>{n}</p>
              <p style={{ fontSize: '11px', color: '#6B6A7D', marginTop: '2px' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: '#6C63FF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '12px',
            }}>IF</div>
            <span style={{ fontWeight: '700', color: '#F0EFF8' }}>
              Interview<span style={{ color: '#6C63FF' }}>Forge</span>
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#F0EFF8', marginBottom: '8px' }}>
              Welcome back
            </h2>
            <p style={{ color: '#6B6A7D', fontSize: '14px' }}>
              Sign in to continue your preparation
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div style={{
              marginBottom: '20px', padding: '12px 16px', borderRadius: '10px',
              background: 'rgba(255,87,87,0.1)', border: '1px solid rgba(255,87,87,0.2)',
              color: '#FF5757', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ⚠ {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              autoComplete="email"
              autoFocus
            />

            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="current-password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ cursor: 'pointer', color: '#6B6A7D', background: 'none', border: 'none' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '12px 20px', borderRadius: '10px',
                background: isLoading ? 'rgba(108,99,255,0.5)' : '#6C63FF',
                color: 'white', fontWeight: '600', fontSize: '14px',
                border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 0 24px rgba(108,99,255,0.25)',
                transition: 'all 0.2s', marginTop: '4px',
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Signing in...
                </>
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '24px 0', color: '#3D3C52', fontSize: '12px',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
            OR
            <div style={{ flex: 1, height: '1px', background: '#1E1E2E' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6B6A7D' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: '#6C63FF', fontWeight: '500', textDecoration: 'none',
            }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>

      {/* Spin keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;