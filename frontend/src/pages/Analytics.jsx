// frontend/src/pages/Analytics.jsx
import { RefreshCw, BarChart3 } from 'lucide-react';
import useAnalytics    from '../hooks/useAnalytics';
import SummaryCards    from '../components/analytics/SummaryCards';
import ScoreTrendChart from '../components/analytics/ScoreTrendChart';
import TopicAnalysis   from '../components/analytics/TopicAnalysis';
import CompanyBreakdown from '../components/analytics/CompanyBreakdown';
import DifficultyStats  from '../components/analytics/DifficultyStats';
import QuestionTypeStats from '../components/analytics/QuestionTypeStats';
import Spinner         from '../components/ui/Spinner';
import Button          from '../components/ui/Button';

const Skeleton = ({ height = 40, radius = 10, width = '100%', style = {} }) => (
  <div style={{
    height, width, borderRadius: radius,
    background: 'linear-gradient(90deg, #1A1A24 25%, #1E1E2E 50%, #1A1A24 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    ...style,
  }} />
);

const SkeletonDashboard = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <style>{`
      @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }
    `}</style>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
      {[...Array(4)].map((_, i) => <Skeleton key={i} height={110} />)}
    </div>
    <Skeleton height={320} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <Skeleton height={260} />
      <Skeleton height={260} />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <Skeleton height={200} />
      <Skeleton height={200} />
    </div>
  </div>
);


const EmptyState = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '400px', gap: '16px', textAlign: 'center',
  }}>
    <div style={{
      width: '64px', height: '64px', borderRadius: '18px',
      background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <BarChart3 size={28} color="#6C63FF" />
    </div>
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F0EFF8', marginBottom: '8px' }}>
        Not enough data yet
      </h3>
      <p style={{ fontSize: '14px', color: '#6B6A7D', maxWidth: '360px', lineHeight: 1.6 }}>
        Complete at least 2 interviews to unlock your analytics dashboard.
        Your trends, topic analysis, and progress charts will appear here.
      </p>
    </div>
    <a href="/setup" style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '10px 20px', borderRadius: '10px', background: '#6C63FF',
      color: 'white', fontWeight: '600', fontSize: '14px',
      textDecoration: 'none', boxShadow: '0 0 20px rgba(108,99,255,0.25)',
    }}>
      Start an Interview →
    </a>
  </div>
);

const Analytics = () => {
  const {
    overview, trends, topics, companies,
    breakdown, isLoading, error, refetch,
  } = useAnalytics();

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: '32px',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '999px', marginBottom: '10px',
              background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
              fontSize: '11px', fontWeight: '500', color: '#6C63FF',
            }}>
              <BarChart3 size={11} />
              Performance Analytics
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#F0EFF8', marginBottom: '6px' }}>
              Your Progress
            </h1>
            <p style={{ fontSize: '14px', color: '#6B6A7D' }}>
              {overview?.totalSessions
                ? `${overview.totalSessions} sessions · ${overview.totalQuestions} questions answered`
                : 'Track your interview performance over time'}
            </p>
          </div>

          <button
            onClick={refetch}
            disabled={isLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px',
              background: 'transparent', border: '1px solid #1E1E2E',
              color: '#6B6A7D', fontSize: '13px', fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = '#6C63FF';
              e.target.style.color = '#6C63FF';
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = '#1E1E2E';
              e.target.style.color = '#6B6A7D';
            }}
          >
            <RefreshCw size={14} style={{
              animation: isLoading ? 'spin 1s linear infinite' : 'none',
            }} />
            Refresh
          </button>
        </div>

        {/* ── LOADING ── */}
        {isLoading && <SkeletonDashboard />}

        {/* ── ERROR ── */}
        {!isLoading && error && (
          <div style={{
            padding: '20px 24px', borderRadius: '14px',
            background: 'rgba(255,87,87,0.08)', border: '1px solid rgba(255,87,87,0.2)',
            color: '#FF5757', fontSize: '14px', textAlign: 'center',
          }}>
            ⚠ {error}
            <button
              onClick={refetch}
              style={{
                marginLeft: '12px', padding: '4px 12px', borderRadius: '8px',
                background: 'rgba(255,87,87,0.1)', border: '1px solid rgba(255,87,87,0.2)',
                color: '#FF5757', fontSize: '12px', cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!isLoading && !error && (overview?.totalSessions || 0) < 2 && (
          <EmptyState />
        )}

        {/* ── DASHBOARD ── */}
        {!isLoading && !error && (overview?.totalSessions || 0) >= 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Row 1: Summary cards */}
            <SummaryCards overview={overview} />

            {/* Row 2: Score trend (full width) */}
            <ScoreTrendChart trends={trends} />

            {/* Row 3: Topic analysis (full width) */}
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700',
                           color: '#F0EFF8', marginBottom: '12px' }}>
                Topic Analysis
              </h2>
              <TopicAnalysis topics={topics} />
            </div>

            {/* Row 4: Company + Difficulty */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <CompanyBreakdown companies={companies} />
              <DifficultyStats  breakdown={breakdown} />
            </div>

            {/* Row 5: Question types (full width) */}
            <QuestionTypeStats overview={overview} />

          </div>
        )}

        {/* Spin keyframe */}
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
};

export default Analytics;