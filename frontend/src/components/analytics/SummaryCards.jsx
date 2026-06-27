// frontend/src/components/analytics/SummaryCards.jsx
import { TrendingUp, TrendingDown, Minus, Award, Target, Clock, Zap } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div style={{
    background: '#111118',
    border: '1px solid #1E1E2E',
    borderRadius: '16px',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: '100px', height: '100px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
      pointerEvents: 'none',
    }} />

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: `${color}15`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color={color} />
      </div>
      {trend !== undefined && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '12px', fontWeight: '600',
          color: trend > 0 ? '#00D9A3' : trend < 0 ? '#FF5757' : '#6B6A7D',
        }}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>

    <div>
      <p style={{
        fontSize: '11px',
        color: '#6B6A7D',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '4px'
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '32px',
        fontWeight: '700',
        fontFamily: 'JetBrains Mono, monospace',
        color,
        lineHeight: 1
      }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: '12px', color: '#6B6A7D', marginTop: '4px' }}>{sub}</p>
      )}
    </div>
  </div>
);

const SummaryCards = ({ overview }) => {
  if (!overview) return null;

  const {
    totalSessions, avgOverallScore, bestScore,
    improvementPct, totalQuestions, avgDuration,
  } = overview;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    }}>
      <StatCard
        icon={Zap}
        label="Total Interviews"
        value={totalSessions}
        sub={`${totalQuestions} questions answered`}
        color="#6C63FF"
      />
      <StatCard
        icon={Target}
        label="Average Score"
        value={`${avgOverallScore}/10`}
        sub="across all sessions"
        color="#00D9A3"
        trend={improvementPct}
      />
      <StatCard
        icon={Award}
        label="Personal Best"
        value={`${bestScore}/10`}
        sub="highest session score"
        color="#FFB547"
      />
      <StatCard
        icon={Clock}
        label="Avg Duration"
        value={`${avgDuration || 0}m`}
        sub="per interview session"
        color="#6C63FF"
      />
    </div>
  );
};

export default SummaryCards;