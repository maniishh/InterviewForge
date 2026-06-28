import { Target, Calendar, TrendingUp, BookOpen } from 'lucide-react';

const ProgressRing = ({ pct, size = 100, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  const col = pct >= 70 ? '#00D9A3' : pct >= 40 ? '#6C63FF' : '#FFB547';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1E1E2E" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: '22px',
            fontWeight: '700',
            fontFamily: 'monospace',
            color: col,
          }}
        >
          {pct}%
        </span>
        <span style={{ fontSize: '10px', color: '#6B6A7D' }}>done</span>
      </div>
    </div>
  );
};

const RoadmapProgress = ({ roadmap }) => {
  if (!roadmap) return null;

  const {
    title,
    summary,
    targetScore,
    estimatedWeeks,
    progressPct = 0,
    analyticsSnapshot,
    phases = [],
  } = roadmap;

  const totalTasks = phases.reduce(
    (s, p) => s + p.weeks.reduce((ws, w) => ws + (w.dailyTasks?.length || 0), 0),
    0
  );

  const doneTasks = phases.reduce(
    (s, p) =>
      s +
      p.weeks.reduce(
        (ws, w) => ws + (w.dailyTasks?.filter(t => t.completed)?.length || 0),
        0
      ),
    0
  );

  return (
    <div
      style={{
        background: '#111118',
        border: '1px solid #1E1E2E',
        borderRadius: '20px',
        padding: '28px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <ProgressRing pct={progressPct} size={110} stroke={9} />

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '999px',
              marginBottom: '8px',
              background: 'rgba(108,99,255,0.1)',
              border: '1px solid rgba(108,99,255,0.2)',
              fontSize: '11px',
              fontWeight: '500',
              color: '#6C63FF',
            }}
          >
            ✦ AI-Generated Roadmap
          </div>

          <h2
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#F0EFF8',
              marginBottom: '8px',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: '13px',
              color: '#6B6A7D',
              lineHeight: 1.6,
              maxWidth: '520px',
              marginBottom: '16px',
            }}
          >
            {summary}
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { icon: Target, label: `Target: ${targetScore}/10`, color: '#00D9A3' },
              { icon: Calendar, label: `${estimatedWeeks} weeks`, color: '#6C63FF' },
              { icon: BookOpen, label: `${doneTasks}/${totalTasks} tasks`, color: '#FFB547' },
              {
                icon: TrendingUp,
                label: `From ${analyticsSnapshot?.avgOverallScore || 0}/10`,
                color: '#FF5757',
              },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  background: `${color}10`,
                  border: `1px solid ${color}25`,
                  fontSize: '12px',
                  fontWeight: '500',
                  color,
                }}
              >
                <Icon size={12} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapProgress;